import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NotificationToast: React.FC = () => {
  const { notifications, removeNotification } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getColorClasses = (type: string) => {
    switch (type) {
      case 'success':
        return 'from-green-900/40 to-green-800/20 border-green-700/30';
      case 'error':
        return 'from-red-900/40 to-red-800/20 border-red-700/30';
      case 'warning':
        return 'from-yellow-900/40 to-yellow-800/20 border-yellow-700/30';
      case 'info':
      default:
        return 'from-blue-900/40 to-blue-800/20 border-blue-700/30';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`bg-gradient-to-br ${getColorClasses(notification.type)} backdrop-blur-sm rounded-xl p-4 border shadow-lg animate-slide-in-right`}
        >
          <div className="flex items-start gap-3">
            {getIcon(notification.type)}
            <div className="flex-1">
              <p className="font-semibold text-white text-sm mb-1">
                {notification.title}
              </p>
              <p className="text-gray-300 text-xs">{notification.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
