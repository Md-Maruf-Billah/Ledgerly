import React, { useState, useEffect } from 'react';
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

const initialProfile = { fullName: '', businessName: '', email: '', state: '', type: '' };

function generateNotifications(taskList, profile) {
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

  useEffect(() => {
    const saved = loadState();
    if (saved) {
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
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveState({ currentScreen, userProfile, tasks, completedTasks, completedThisMonth, notifications });
  }, [ready, currentScreen, userProfile, tasks, completedTasks, completedThisMonth, notifications]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDemoLogin = () => {
    const taskList = recomputeStatuses(businessTypeTasks['Sole Trader']);
    setUserProfile(demoUserProfile);
    setTasks(taskList);
    setCompletedTasks([]);
    setCompletedThisMonth(0);
    setNotifications(generateNotifications(taskList, demoUserProfile));
    setCurrentScreen('dashboard');
  };

  const handleLoginSuccess = () => setCurrentScreen('tour');

  const handleProfileContinue = (profileData) => {
    setUserProfile(prev => ({ ...prev, ...profileData }));
    setCurrentScreen('business-type');
  };

  const handleBuildCalendar = (type) => {
    const taskList = recomputeStatuses(businessTypeTasks[type] || []);
    const updatedProfile = { ...userProfile, type };
    setUserProfile(updatedProfile);
    setTasks(taskList);
    setCompletedTasks([]);
    setCompletedThisMonth(0);
    setNotifications(generateNotifications(taskList, updatedProfile));
    setCurrentScreen('loading');
  };

  const handleOpenTask = (task) => setSelectedTask(task);
  const handleCloseTask = () => setSelectedTask(null);

  const handleMarkDone = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== 'completed') {
      const completedAt = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
      const completed = {
        ...task,
        status: 'completed',
        completedAt,
      };
      setCompletedTasks(prev => [completed, ...prev]);
      setTasks(prev => prev.map(t => (
        t.id === taskId
          ? { ...t, status: 'completed', completedAt }
          : t
      )));
      setNotifications(prev => [{
        id: `done-${taskId}-${Date.now()}`,
        type: 'completed',
        title: `${task.name} marked complete`,
        body: 'Great work. It remains visible as completed in your timeline and calendar.',
        timestamp: Date.now(),
        read: false,
      }, ...prev]);
      setCompletedThisMonth(prev => prev + 1);
    }
    setSelectedTask(null);
    setCurrentScreen('confirmation');
  };

  const handleAddCustomTask = (data) => {
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
    setShowCustomModal(false);
    showToast('Task added to your calendar');
  };

  const handleLogout = () => {
    setCurrentScreen('login');
    setUserProfile(initialProfile);
    setTasks([]);
    setCompletedTasks([]);
    setSelectedTask(null);
    setCompletedThisMonth(0);
    setNotifications([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const pendingTasks = tasks.filter(t => t.status !== 'completed');

  if (!ready) return null;

  return (
    <main className="app-shell">
      {toast && (
        <div className={`toast toast-${toast.type}`} role="status" aria-live="polite">
          {toast.message}
        </div>
      )}

      {currentScreen === 'login' && (
        <LoginScreen onLoginSuccess={handleLoginSuccess} onDemoLogin={handleDemoLogin} />
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
