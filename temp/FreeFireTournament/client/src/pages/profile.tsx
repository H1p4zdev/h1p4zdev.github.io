import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import NavBar from "@/components/nav-bar";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/auth-context";
import { get, ref } from "firebase/database";
import { doc, getDoc } from "firebase/firestore";
import { db, firestore } from "@/lib/firebase";
import { UserProfile, UserActivity } from "@shared/schema";

export default function Profile() {
  const { currentUser } = useAuth();
  const [_, setLocation] = useLocation();
  
  useEffect(() => {
    if (!currentUser) {
      setLocation("/");
    }
  }, [currentUser, setLocation]);

  // Fetch user profile data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/users', currentUser?.uid, 'profile'],
    queryFn: async () => {
      if (!currentUser?.uid) return null;
      const docRef = doc(firestore, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      
      return null;
    },
    enabled: !!currentUser
  });

  // Fetch user activity
  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['/api/users', currentUser?.uid, 'activities'],
    queryFn: async () => {
      if (!currentUser?.uid) return [];
      const snapshot = await get(ref(db, `users/${currentUser.uid}/activities`));
      
      if (snapshot.exists()) {
        return Object.values(snapshot.val()) as UserActivity[];
      }
      
      return [];
    },
    enabled: !!currentUser
  });

  if (!currentUser) return null;

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Default profile if none exists
  const userProfile = profile || {
    username: currentUser.displayName || currentUser.email?.split('@')[0] || "Player",
    level: 1,
    rank: "Rookie",
    verified: false,
    tournamentsWon: 0,
    matches: 0,
    tournaments: 0,
    kills: 0,
    stats: {
      winRate: 0,
      kdRatio: 0,
      headshotPercentage: 0,
      avgSurvivalTime: "00:00"
    },
    achievements: []
  };

  return (
    <div className="profile-screen">
      <header className="bg-dark-surface p-4">
        <div className="container mx-auto">
          <div className="flex items-center">
            <button className="mr-3 text-white" onClick={() => setLocation('/dashboard')}>
              <i className="ri-arrow-left-line text-xl"></i>
            </button>
            <h1 className="text-2xl font-bold text-white font-rajdhani">PROFILE</h1>
          </div>
        </div>
      </header>

      <div className="p-4 container mx-auto mb-20">
        <div className="bg-dark-surface rounded-xl overflow-hidden mb-6">
          {/* Profile Banner */}
          <div className="h-24 bg-gradient-to-r from-primary to-secondary relative">
            <button className="absolute right-3 top-3 bg-dark-surface bg-opacity-50 p-1 rounded-full">
              <i className="ri-pencil-line text-white"></i>
            </button>
          </div>
          
          <div className="flex flex-col items-center -mt-12 px-4 pb-6">
            {currentUser.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt="Profile Avatar" 
                className="w-24 h-24 rounded-full border-4 border-dark-surface object-cover" 
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-dark-surface bg-dark-lighter flex items-center justify-center text-white text-4xl">
                {userProfile.username.charAt(0).toUpperCase()}
              </div>
            )}
            
            <h2 className="text-xl font-bold text-white mt-3 font-rajdhani">{userProfile.username}</h2>
            <p className="text-text-secondary text-sm">Level {userProfile.level} • {userProfile.rank}</p>
            
            <div className="flex items-center mt-2">
              {userProfile.verified && (
                <div className="bg-success text-white text-xs px-2 py-1 rounded flex items-center mr-2">
                  <i className="ri-verified-badge-line mr-1"></i> Verified
                </div>
              )}
              <div className="bg-warning bg-opacity-20 text-warning text-xs px-2 py-1 rounded flex items-center">
                <i className="ri-trophy-line mr-1"></i> {userProfile.tournamentsWon} Tournaments Won
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-8 mt-6 w-full">
              <div className="text-center">
                <p className="text-xl font-bold text-white font-rajdhani">{userProfile.matches}</p>
                <p className="text-xs text-text-secondary">Matches</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-white font-rajdhani">{userProfile.tournaments}</p>
                <p className="text-xs text-text-secondary">Tournaments</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-white font-rajdhani">
                  {userProfile.kills >= 1000 ? `${(userProfile.kills / 1000).toFixed(1)}K` : userProfile.kills}
                </p>
                <p className="text-xs text-text-secondary">Kills</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Game Statistics */}
        <div className="bg-dark-surface rounded-xl p-5 mb-6">
          <h3 className="text-xl font-bold text-white font-rajdhani mb-4">GAME STATISTICS</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-text-secondary text-sm">Win Rate</p>
              <div className="flex items-center">
                <p className="font-bold text-white text-lg mr-2 font-rajdhani">{userProfile.stats.winRate}%</p>
                <div className="w-full">
                  <Progress value={userProfile.stats.winRate} className="h-2 bg-dark-lighter" indicatorColor="bg-success" />
                </div>
              </div>
            </div>
            <div>
              <p className="text-text-secondary text-sm">K/D Ratio</p>
              <div className="flex items-center">
                <p className="font-bold text-white text-lg mr-2 font-rajdhani">{userProfile.stats.kdRatio}</p>
                <div className="w-full">
                  <Progress 
                    value={Math.min(userProfile.stats.kdRatio * 20, 100)} 
                    className="h-2 bg-dark-lighter" 
                    indicatorColor="bg-primary" 
                  />
                </div>
              </div>
            </div>
            <div>
              <p className="text-text-secondary text-sm">Headshot %</p>
              <div className="flex items-center">
                <p className="font-bold text-white text-lg mr-2 font-rajdhani">{userProfile.stats.headshotPercentage}%</p>
                <div className="w-full">
                  <Progress 
                    value={userProfile.stats.headshotPercentage} 
                    className="h-2 bg-dark-lighter" 
                    indicatorColor="bg-warning"
                  />
                </div>
              </div>
            </div>
            <div>
              <p className="text-text-secondary text-sm">Avg. Survival Time</p>
              <div className="flex items-center">
                <p className="font-bold text-white text-lg mr-2 font-rajdhani">{userProfile.stats.avgSurvivalTime}</p>
                <div className="w-full">
                  <Progress value={75} className="h-2 bg-dark-lighter" indicatorColor="bg-secondary" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Achievements */}
        <div className="bg-dark-surface rounded-xl p-5 mb-6">
          <h3 className="text-xl font-bold text-white font-rajdhani mb-4">ACHIEVEMENTS</h3>
          
          <div className="grid grid-cols-4 gap-4">
            {userProfile.achievements && userProfile.achievements.length > 0 ? (
              userProfile.achievements.map((achievement, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${achievement.colorClass} flex items-center justify-center`}>
                    <i className={`${achievement.icon} text-white text-xl`}></i>
                  </div>
                  <p className="text-xs text-text-secondary mt-2 text-center">{achievement.name}</p>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-4">
                <p className="text-text-secondary">No achievements unlocked yet. Keep playing to earn achievements!</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-dark-surface rounded-xl p-5">
          <h3 className="text-xl font-bold text-white font-rajdhani mb-4">RECENT ACTIVITY</h3>
          
          {activitiesLoading ? (
            <div className="p-4 flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : activities && activities.length > 0 ? (
            <>
              {activities.slice(0, 3).map((activity, index) => (
                <div key={index} className="flex items-start mb-4">
                  <div className={`w-10 h-10 rounded-full bg-dark-lighter flex items-center justify-center mr-3 flex-shrink-0`}>
                    <i className={`${activity.icon} ${activity.iconColor}`}></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{activity.text}</h4>
                    <p className="text-xs text-text-secondary">{new Date(activity.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
              
              <button className="text-secondary text-sm font-medium mt-4 flex items-center mx-auto">
                View All Activity <i className="ri-arrow-right-line ml-1"></i>
              </button>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-text-secondary">No recent activity.</p>
            </div>
          )}
        </div>
      </div>

      <NavBar />
    </div>
  );
}
