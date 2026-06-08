import React, { useState, useEffect, useCallback, useMemo } from 'react';
import LoginScreen from './components/LoginScreen';
import BusinessProfileForm from './components/BusinessProfileForm';
import BusinessTypeSelector from './components/BusinessTypeSelector';
import Dashboard from './components/Dashboard';
import TaskDetailPanel from './components/TaskDetailPanel';
import ConfirmationScreen from './components/ConfirmationScreen';
import MonthlySummary from './components/MonthlySummary';
import SettingsScreen from './components/SettingsScreen';
import LoadingScreen from './components/LoadingScreen';
import WelcomeScreen from './components/WelcomeScreen';
import PricingPlans from './components/PricingPlans';
import Notifications from './components/Notifications';
import CustomTaskModal from './components/CustomTaskModal';
import CalendarView from './components/CalendarView';
import OnboardingTour from './components/OnboardingTour';
import { businessTypeTasks, demoUserProfile } from './data/tasks';
import { formatDate, computeTaskStatus, recomputeStatuses } from './utils/dates';
import { loadState, saveState, STORAGE_KEY } from './utils/storage';
import * as api from './utils/api';

const initialProfile = { fullName: '', businessName: '', email: '', state: '', type: '' };

// ─── Demo-only notification generator (no backend) ───────────────────────────
function generateDemoNotifications(taskList, profile) {
  const now = Date.now();
  const notifs = [];
  taskList.filter(t => t.status === 'overdue').forEach((t, i) => {
    notifs.push({
      id: `overdue-${t.id}`,
      type: 'overdue',
      title: `${t.name} is overdue`,
      body: `Due ${formatDate(t.dueDate)}. Review this obligation first when you are ready.`,
      timestamp: now - (i + 1) * 28 * 60 * 1000,
      read: false,
    });
  });
  taskList.filter(t => t.status === 'due-soon').forEach((t, i) => {
    notifs.push({
      id: `soon-${t.id}`,
      type: 'upcoming',
      title: `${t.name} due soon`,
      body: `Due ${formatDate(t.dueDate)}. Schedule time to complete this.`,
      timestamp: now - (i + 2) * 55 * 60 * 1000,
      read: false,
    });
  });
  notifs.push({
    id: 'system-calendar',
    type: 'system',
    title: 'Compliance calendar generated',
    body: `${taskList.length} obligations loaded for ${profile.businessName || 'your business'}.`,
    timestamp: now - 3 * 60 * 1000,
    read: false,
  });
  return notifs;
}

function App() {
  const [ready, setReady] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('login');
  const [userProfile, setUserProfile] = useState(initialProfile);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [completedThisMonth, setCompletedThisMonth] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // ─── [Security] Global 401 listener — expired token → auto logout ──────────
  const handleLogout = useCallback(async () => {
    if (!isDemoMode) {
      await api.logout();
      api.clearToken();
    }
    setCurrentScreen('login');
    setUserProfile(initialProfile);
    setTasks([]);
    setCompletedTasks([]);
    setSelectedTask(null);
    setCompletedThisMonth(0);
    setNotifications([]);
    setIsDemoMode(false);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, [isDemoMode]);

  useEffect(() => {
    const onUnauthorized = () => {
      api.clearToken();
      handleLogout();
      setToast({ message: 'Your session expired. Please sign in again.', type: 'error' });
      setTimeout(() => setToast(null), 4000);
    };
    window.addEventListener('ledgerly:unauthorized', onUnauthorized);
    return () => window.removeEventListener('ledgerly:unauthorized', onUnauthorized);
  }, [handleLogout]);

  // ─── App startup — restore session ─────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const token = api.getToken();

      if (token) {
        // Try to restore real session from backend
        const { data: meData, error: meError } = await api.getMe();

        if (!meError && meData) {
          if (!meData.has_profile) {
            // Authenticated but onboarding not done
            setCurrentScreen('tour');
            setReady(true);
            return;
          }

          // Fetch full profile + tasks + notifications
          const { data: profileData, error: profileError } = await api.getProfile();

          if (!profileError && profileData?.profile) {
            setUserProfile(api.transformProfile(profileData.profile));
            const transformedTasks = (profileData.tasks || []).map(api.transformTask);
            setTasks(recomputeStatuses(transformedTasks));
            const completed = transformedTasks.filter(t => t.status === 'completed');
            setCompletedTasks(completed);
            setCompletedThisMonth(completed.length);
            setNotifications((profileData.notifications || []).map(api.transformNotification));
            setCurrentScreen('dashboard');
            setReady(true);
            return;
          }
        }

        // Token was invalid or expired — clear it
        api.clearToken();
      }

      // No token — check for saved demo state
      const saved = loadState();
      if (saved?.isDemoMode) {
        setIsDemoMode(true);
        if (saved.currentScreen && saved.currentScreen !== 'loading') {
          setCurrentScreen(saved.currentScreen);
        }
        if (saved.userProfile) setUserProfile(saved.userProfile);
        if (saved.tasks) setTasks(recomputeStatuses(saved.tasks));
        if (saved.completedTasks) setCompletedTasks(saved.completedTasks);
        if (typeof saved.completedThisMonth === 'number') setCompletedThisMonth(saved.completedThisMonth);
        if (saved.notifications) setNotifications(saved.notifications);
      }

      setReady(true);
    };

    init();
  }, []);

  // ─── Persist demo state to localStorage ────────────────────────────────────
  useEffect(() => {
    if (!ready || !isDemoMode) return;
    saveState({ isDemoMode, currentScreen, userProfile, tasks, completedTasks, completedThisMonth, notifications });
  }, [ready, isDemoMode, currentScreen, userProfile, tasks, completedTasks, completedThisMonth, notifications]);

  // ─── Toast helper ───────────────────────────────────────────────────────────
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ─── Demo mode ──────────────────────────────────────────────────────────────
  const handleDemoLogin = () => {
    const taskList = recomputeStatuses(businessTypeTasks['Sole Trader']);
    setIsDemoMode(true);
    setUserProfile(demoUserProfile);
    setTasks(taskList);
    setCompletedTasks([]);
    setCompletedThisMonth(0);
    setNotifications(generateDemoNotifications(taskList, demoUserProfile));
    setCurrentScreen('dashboard');
  };

  // ─── Real auth ──────────────────────────────────────────────────────────────
  const handleLoginSuccess = async (email, password, setAuthError, setLoading) => {
    const { data, error } = await api.login(email, password);
    if (error) {
      setAuthError(error);
      setLoading(false);
      return;
    }
    api.setToken(data.access_token);
    setIsDemoMode(false);

    if (data.is_new_user) {
      // New user — send through onboarding
      setCurrentScreen('tour');
      setLoading(false);
      return;
    }

    // Returning user — fetch their data
    const { data: profileData, error: profileError } = await api.getProfile();
    if (profileError || !profileData?.profile) {
      // Authenticated but no profile yet
      setCurrentScreen('tour');
      setLoading(false);
      return;
    }

    setUserProfile(api.transformProfile(profileData.profile));
    const transformedTasks = (profileData.tasks || []).map(api.transformTask);
    setTasks(recomputeStatuses(transformedTasks));
    const completed = transformedTasks.filter(t => t.status === 'completed');
    setCompletedTasks(completed);
    setCompletedThisMonth(completed.length);
    setNotifications((profileData.notifications || []).map(api.transformNotification));
    setCurrentScreen('dashboard');
    setLoading(false);
  };

  const handleRegisterSuccess = async (email, password, setAuthError, setLoading) => {
    const { data, error } = await api.register(email, password);
    if (error) {
      setAuthError(error);
      setLoading(false);
      return;
    }
    if (!data.access_token) {
      setAuthError('Account created — please check your email and confirm your account, then sign in.');
      setLoading(false);
      return;
    }
    api.setToken(data.access_token);
    setIsDemoMode(false);
    setCurrentScreen('tour');
    setLoading(false);
  };

  // ─── Onboarding ─────────────────────────────────────────────────────────────
  const handleProfileContinue = (profileData) => {
    setUserProfile(prev => ({ ...prev, ...profileData }));
    setCurrentScreen('business-type');
  };

  const handleBuildCalendar = async (type) => {
    const taskList = recomputeStatuses(businessTypeTasks[type] || []);
    const updatedProfile = { ...userProfile, type };
    setUserProfile(updatedProfile);

    if (isDemoMode) {
      // Demo: stay local
      setTasks(taskList);
      setCompletedTasks([]);
      setCompletedThisMonth(0);
      setNotifications(generateDemoNotifications(taskList, updatedProfile));
      setCurrentScreen('loading');
      return;
    }

    // Real mode: save profile + seed tasks in one request
    setCurrentScreen('loading');
    const { data, error } = await api.saveProfile(updatedProfile, businessTypeTasks[type] || []);

    if (error) {
      showToast('Could not save your calendar. Try again.', 'error');
      setCurrentScreen('business-type');
      return;
    }

    const transformedTasks = (data.tasks || []).map(api.transformTask);
    setTasks(recomputeStatuses(transformedTasks));
    setCompletedTasks([]);
    setCompletedThisMonth(0);
    setNotifications((data.notifications || []).map(api.transformNotification));
  };

  // ─── Task actions ────────────────────────────────────────────────────────────
  // useCallback: these are passed as props to memo'd children. Without it,
  // a new function reference on every App render defeats memo on Dashboard,
  // TaskDetailPanel, CalendarView, etc.
  const handleOpenTask  = useCallback((task) => setSelectedTask(task), []);
  const handleCloseTask = useCallback(() => setSelectedTask(null), []);

  const handleMarkDone = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === 'completed') {
      setSelectedTask(null);
      setCurrentScreen('confirmation');
      return;
    }

    if (isDemoMode) {
      const completedAt = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
      const completed = { ...task, status: 'completed', completedAt };
      setCompletedTasks(prev => [completed, ...prev]);
      setTasks(prev => prev.map(t => t.id === taskId ? completed : t));
      setNotifications(prev => [{
        id: `done-${taskId}-${Date.now()}`,
        type: 'completed',
        title: `${task.name} marked complete`,
        body: 'Great work. It remains visible as completed in your timeline and calendar.',
        timestamp: Date.now(),
        read: false,
      }, ...prev]);
      setCompletedThisMonth(prev => prev + 1);
    } else {
      const { data, error } = await api.markTaskDone(taskId);
      if (error) {
        showToast('Could not update task. Try again.', 'error');
        setSelectedTask(null);
        return;
      }
      const updatedTask = api.transformTask(data.task);
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      setCompletedTasks(prev => [updatedTask, ...prev]);
      setCompletedThisMonth(prev => prev + 1);
      if (data.notification) {
        setNotifications(prev => [api.transformNotification(data.notification), ...prev]);
      }
    }

    setSelectedTask(null);
    setCurrentScreen('confirmation');
  };

  const handleAddCustomTask = async (data) => {
    if (isDemoMode) {
      const task = {
        id: `custom-${Date.now()}`,
        name: data.name,
        description: data.notes || 'Custom compliance task',
        dueDate: data.dueDate,
        steps: ['Review requirements', 'Complete the action', 'Confirm and file'],
        status: computeTaskStatus(data.dueDate),
        priority: data.priority,
        isCustom: true,
      };
      setTasks(prev => [task, ...prev]);
    } else {
      const { data: created, error } = await api.createTask({
        name: data.name,
        dueDate: data.dueDate,
        priority: data.priority,
        notes: data.notes,
      });
      if (error) {
        showToast('Could not add task. Try again.', 'error');
        return;
      }
      setTasks(prev => [api.transformTask(created.data), ...prev]);
    }

    setShowCustomModal(false);
    showToast('Task added to your calendar');
  };

  // handleLogout is defined above with useCallback (needed by 401 listener)

  // ─── Notifications ────────────────────────────────────────────────────────────
  const unreadCount = useMemo(
    () => notifications.filter(n => !n.read).length,
    [notifications]
  );

  const markAllRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if (!isDemoMode) await api.markAllNotificationsRead();
  }, [isDemoMode]);

  const pendingTasks = useMemo(
    () => tasks.filter(t => t.status !== 'completed'),
    [tasks]
  );

  if (!ready) return null;

  return (
    <main className="app-shell" id="main-content">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {toast && (
        <div className={`toast toast-${toast.type}`} role="status" aria-live="polite">
          {toast.message}
        </div>
      )}

      {currentScreen === 'login' && (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onRegisterSuccess={handleRegisterSuccess}
          onDemoLogin={handleDemoLogin}
        />
      )}
      {currentScreen === 'profile' && (
        <BusinessProfileForm
          initialData={userProfile}
          onContinue={handleProfileContinue}
          onBack={() => setCurrentScreen('login')}
        />
      )}
      {currentScreen === 'tour' && (
        <OnboardingTour
          onContinue={() => setCurrentScreen('profile')}
          onBack={() => setCurrentScreen('login')}
        />
      )}
      {currentScreen === 'business-type' && (
        <BusinessTypeSelector
          selectedType={userProfile.type}
          onBuildCalendar={handleBuildCalendar}
          onBack={() => setCurrentScreen('profile')}
        />
      )}
      {currentScreen === 'loading' && (
        <LoadingScreen onComplete={() => setCurrentScreen('welcome')} />
      )}
      {currentScreen === 'welcome' && (
        <WelcomeScreen
          profile={userProfile}
          taskCount={tasks.length}
          onContinue={() => setCurrentScreen('dashboard')}
        />
      )}
      {currentScreen === 'dashboard' && (
        <Dashboard
          userProfile={userProfile}
          tasks={tasks}
          completedCount={completedThisMonth}
          onOpenTask={handleOpenTask}
          onOpenSummary={() => setCurrentScreen('summary')}
          onOpenSettings={() => setCurrentScreen('settings')}
          onOpenNotifications={() => { markAllRead(); setCurrentScreen('notifications'); }}
          onOpenPricing={() => setCurrentScreen('pricing')}
          onOpenCalendar={() => setCurrentScreen('calendar')}
          onAddTask={() => setShowCustomModal(true)}
          unreadCount={unreadCount}
        />
      )}
      {currentScreen === 'confirmation' && (
        <ConfirmationScreen
          completedCount={completedThisMonth}
          onBackToTimeline={() => setCurrentScreen('dashboard')}
          onViewSummary={() => setCurrentScreen('summary')}
        />
      )}
      {currentScreen === 'summary' && (
        <MonthlySummary
          onBack={() => setCurrentScreen('dashboard')}
          completedCount={completedThisMonth}
          tasks={pendingTasks}
          completedTasks={completedTasks}
          onExportSuccess={() => showToast('Summary exported successfully')}
        />
      )}
      {currentScreen === 'settings' && (
        <SettingsScreen
          profile={userProfile}
          onBack={() => setCurrentScreen('dashboard')}
          onLogout={handleLogout}
          onToast={showToast}
        />
      )}
      {currentScreen === 'notifications' && (
        <Notifications
          notifications={notifications}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}
      {currentScreen === 'pricing' && (
        <PricingPlans onBack={() => setCurrentScreen('dashboard')} />
      )}
      {currentScreen === 'calendar' && (
        <CalendarView
          tasks={tasks}
          onBack={() => setCurrentScreen('dashboard')}
          onOpenTask={handleOpenTask}
        />
      )}

      <TaskDetailPanel task={selectedTask} onClose={handleCloseTask} onMarkDone={handleMarkDone} />
      {showCustomModal && (
        <CustomTaskModal onSave={handleAddCustomTask} onClose={() => setShowCustomModal(false)} />
      )}
    </main>
  );
}

export default App;
