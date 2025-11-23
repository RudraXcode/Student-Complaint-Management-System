import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  AlertTriangle, 
  Clock, 
  Bell, 
  X, 
  Siren,
  Timer,
  Zap,
  Flame,
  Skull
} from 'lucide-react';
import { Complaint } from '../App';

interface AdminReminderSystemProps {
  complaints: Complaint[];
  onComplaintSelect: (complaint: Complaint) => void;
}

interface OverdueComplaint extends Complaint {
  urgencyLevel: 1 | 2 | 3 | 4 | 5; // 1 = mild, 5 = critical
  reminderCount: number;
}

export function AdminReminderSystem({ complaints, onComplaintSelect }: AdminReminderSystemProps) {
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderCount, setReminderCount] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [dismissed, setDismissed] = useState<string[]>([]);

  // Calculate overdue complaints with urgency levels
  const overdueComplaints: OverdueComplaint[] = complaints
    .filter(c => c.status !== 'Resolved' && c.daysOpened > 0)
    .map(complaint => {
      let urgencyLevel: 1 | 2 | 3 | 4 | 5 = 1;
      let reminderCount = 0;

      if (complaint.daysOpened >= 1 && complaint.daysOpened < 3) {
        urgencyLevel = 1;
        reminderCount = Math.floor(complaint.daysOpened / 1);
      } else if (complaint.daysOpened >= 3 && complaint.daysOpened < 7) {
        urgencyLevel = 2;
        reminderCount = Math.floor(complaint.daysOpened / 1) + 5;
      } else if (complaint.daysOpened >= 7 && complaint.daysOpened < 14) {
        urgencyLevel = 3;
        reminderCount = Math.floor(complaint.daysOpened / 1) + 15;
      } else if (complaint.daysOpened >= 14 && complaint.daysOpened < 30) {
        urgencyLevel = 4;
        reminderCount = Math.floor(complaint.daysOpened / 1) + 30;
      } else if (complaint.daysOpened >= 30) {
        urgencyLevel = 5;
        reminderCount = Math.floor(complaint.daysOpened / 1) + 60;
      }

      return {
        ...complaint,
        urgencyLevel,
        reminderCount
      };
    })
    .sort((a, b) => b.urgencyLevel - a.urgencyLevel || b.daysOpened - a.daysOpened);

  const criticalComplaints = overdueComplaints.filter(c => c.urgencyLevel >= 4);
  const highUrgencyComplaints = overdueComplaints.filter(c => c.urgencyLevel === 3);
  const moderateComplaints = overdueComplaints.filter(c => c.urgencyLevel === 2);

  // Play annoying sound effect
  const playReminderSound = () => {
    if (!audioEnabled) return;
    
    // Create annoying beep sequence
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  // Show reminder modal periodically based on urgency
  useEffect(() => {
    if (criticalComplaints.length === 0) return;

    const interval = setInterval(() => {
      setReminderCount(prev => prev + 1);
      
      // Show modal more frequently for critical complaints
      const shouldShow = criticalComplaints.length > 0 && 
        (criticalComplaints.length >= 3 || reminderCount % (5 - Math.min(criticalComplaints.length, 4)) === 0);
      
      if (shouldShow) {
        setShowReminderModal(true);
        playReminderSound();
      }
    }, criticalComplaints.length >= 5 ? 30000 : 60000); // More frequent for more complaints

    return () => clearInterval(interval);
  }, [criticalComplaints.length, reminderCount, audioEnabled]);

  const getUrgencyIcon = (level: number) => {
    switch (level) {
      case 1: return <Clock className="h-4 w-4 text-yellow-500" />;
      case 2: return <Bell className="h-4 w-4 text-orange-500" />;
      case 3: return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 4: return <Flame className="h-4 w-4 text-red-600" />;
      case 5: return <Skull className="h-4 w-4 text-red-800" />;
      default: return <Timer className="h-4 w-4" />;
    }
  };

  const getUrgencyBanner = () => {
    if (criticalComplaints.length >= 5) {
      return (
        <Alert className="border-red-600 bg-red-50 animate-pulse mb-4">
          <Skull className="h-5 w-5 text-red-800" />
          <AlertTitle className="text-red-800 font-bold">🚨 SYSTEM OVERLOAD - IMMEDIATE ACTION REQUIRED! 🚨</AlertTitle>
          <AlertDescription className="text-red-700">
            <span className="font-bold animate-bounce inline-block">{criticalComplaints.length} CRITICAL COMPLAINTS</span> are severely overdue! 
            Students are waiting! University reputation at risk!
            <Button 
              className="ml-2 bg-red-600 hover:bg-red-700 animate-pulse" 
              size="sm"
              onClick={() => onComplaintSelect(criticalComplaints[0])}
            >
              RESOLVE NOW! ⚡
            </Button>
          </AlertDescription>
        </Alert>
      );
    } else if (criticalComplaints.length > 0) {
      return (
        <Alert className="border-red-500 bg-red-50 animate-pulse mb-4">
          <Flame className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-700 font-bold">🔥 CRITICAL COMPLAINTS OVERDUE!</AlertTitle>
          <AlertDescription className="text-red-600">
            {criticalComplaints.length} complaint{criticalComplaints.length > 1 ? 's have' : ' has'} been open for 14+ days! 
            This is unacceptable! Take action immediately!
          </AlertDescription>
        </Alert>
      );
    } else if (highUrgencyComplaints.length > 0) {
      return (
        <Alert className="border-orange-500 bg-orange-50 mb-4">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <AlertTitle className="text-orange-700 font-bold">⚠️ High Priority Complaints Pending</AlertTitle>
          <AlertDescription className="text-orange-600">
            {highUrgencyComplaints.length} complaint{highUrgencyComplaints.length > 1 ? 's have' : ' has'} been open for 7+ days. 
            Please address these soon to avoid escalation.
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  };

  const getTotalOverdueCount = () => overdueComplaints.length;

  const dismissReminder = (complaintId: string) => {
    setDismissed(prev => [...prev, complaintId]);
  };

  return (
    <>
      {/* Persistent Banner */}
      {overdueComplaints.length > 0 && getUrgencyBanner()}

      {/* Floating Reminder Cards */}
      <div className="space-y-4">
        {/* Critical Complaints - Always Visible */}
        {criticalComplaints.length > 0 && (
          <Card className="border-red-600 bg-gradient-to-r from-red-50 to-red-100 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-red-800 flex items-center gap-2">
                <div className="animate-spin">
                  <Siren className="h-6 w-6" />
                </div>
                <span className="animate-pulse font-bold">
                  CRITICAL: {criticalComplaints.length} Complaint{criticalComplaints.length > 1 ? 's' : ''} Severely Overdue
                </span>
              </CardTitle>
              <CardDescription className="text-red-700">
                These complaints are damaging your performance metrics!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {criticalComplaints.slice(0, 3).map((complaint) => (
                  <div 
                    key={complaint.id}
                    className={`p-3 rounded-lg border-2 border-red-400 bg-red-100 cursor-pointer hover:bg-red-200 transition-all
                      ${complaint.daysOpened > 30 ? 'animate-pulse' : ''}
                      ${complaint.daysOpened > 45 ? 'animate-bounce' : ''}
                    `}
                    onClick={() => onComplaintSelect(complaint)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getUrgencyIcon(complaint.urgencyLevel)}
                        <span className="font-bold text-red-800">{complaint.id}</span>
                        <Badge className="bg-red-600 text-white animate-pulse">
                          {complaint.daysOpened} DAYS OVERDUE!
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-700 font-bold">
                          {complaint.daysOpened > 30 ? '💀 URGENT!' : complaint.daysOpened > 20 ? '🔥 CRITICAL' : '⚠️ OVERDUE'}
                        </span>
                        <Button 
                          size="sm" 
                          className="bg-red-600 hover:bg-red-700 animate-pulse"
                          onClick={(e) => {
                            e.stopPropagation();
                            onComplaintSelect(complaint);
                          }}
                        >
                          FIX NOW!
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-red-700 mt-1 truncate">
                      {complaint.category}: {complaint.description}
                    </p>
                    <div className="text-xs text-red-600 mt-1">
                      Reminder #{complaint.reminderCount} • Priority: {complaint.priority}
                    </div>
                  </div>
                ))}
                {criticalComplaints.length > 3 && (
                  <div className="text-center">
                    <Button 
                      variant="outline" 
                      className="border-red-500 text-red-700 hover:bg-red-100"
                    >
                      View {criticalComplaints.length - 3} More Critical Complaints
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* High Urgency Complaints */}
        {highUrgencyComplaints.length > 0 && (
          <Card className="border-orange-500 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-orange-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 animate-pulse" />
                High Priority: {highUrgencyComplaints.length} Complaint{highUrgencyComplaints.length > 1 ? 's' : ''} Need Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {highUrgencyComplaints.slice(0, 4).map((complaint) => (
                  <div 
                    key={complaint.id}
                    className="p-2 border border-orange-300 rounded bg-orange-100 cursor-pointer hover:bg-orange-200"
                    onClick={() => onComplaintSelect(complaint)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-orange-800">{complaint.id}</span>
                      <Badge className="bg-orange-500 text-white">
                        {complaint.daysOpened} days
                      </Badge>
                    </div>
                    <p className="text-xs text-orange-700 truncate">{complaint.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Reminder Statistics</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={audioEnabled ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}
              >
                {audioEnabled ? '🔊 Audio ON' : '🔇 Audio OFF'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-red-600">{criticalComplaints.length}</div>
                <div className="text-xs text-red-500">Critical (14+ days)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{highUrgencyComplaints.length}</div>
                <div className="text-xs text-orange-500">High (7-13 days)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{moderateComplaints.length}</div>
                <div className="text-xs text-yellow-500">Moderate (3-6 days)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{reminderCount}</div>
                <div className="text-xs text-blue-500">Reminders Sent</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Annoying Pop-up Modal */}
      <Dialog open={showReminderModal} onOpenChange={setShowReminderModal}>
        <DialogContent className="border-red-500 bg-gradient-to-br from-red-50 to-red-100">
          <DialogHeader>
            <DialogTitle className="text-red-800 flex items-center gap-2 text-xl">
              <div className="animate-spin">
                <AlertTriangle className="h-6 w-6" />
              </div>
              🚨 URGENT REMINDER #{reminderCount} 🚨
            </DialogTitle>
            <DialogDescription className="text-red-700 font-medium">
              You have {criticalComplaints.length} CRITICAL complaint{criticalComplaints.length > 1 ? 's' : ''} that 
              {criticalComplaints.length > 1 ? ' are' : ' is'} severely overdue!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-red-200 p-4 rounded-lg border-2 border-red-400">
              <h4 className="font-bold text-red-800 mb-2">Most Critical Complaint:</h4>
              {criticalComplaints[0] && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-600 text-white animate-pulse">
                      {criticalComplaints[0].id}
                    </Badge>
                    <span className="font-bold text-red-800">
                      {criticalComplaints[0].daysOpened} DAYS OVERDUE!
                    </span>
                  </div>
                  <p className="text-red-700">{criticalComplaints[0].description}</p>
                  <p className="text-red-600 text-sm">
                    Student: {criticalComplaints[0].studentName} • Category: {criticalComplaints[0].category}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700 animate-pulse"
                onClick={() => {
                  setShowReminderModal(false);
                  if (criticalComplaints[0]) {
                    onComplaintSelect(criticalComplaints[0]);
                  }
                }}
              >
                🔥 RESOLVE NOW!
              </Button>
              <Button 
                variant="outline"
                className="border-red-500 text-red-700"
                onClick={() => setShowReminderModal(false)}
              >
                Remind Me in 5 Minutes
              </Button>
            </div>
            
            <div className="text-center text-xs text-red-600">
              This reminder will keep appearing until you resolve these complaints!<br />
              💡 Tip: The faster you resolve, the fewer reminders you'll see!
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}