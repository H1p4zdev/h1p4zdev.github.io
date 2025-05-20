import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import NavBar from "@/components/nav-bar";
import TeamCard from "@/components/team-card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Tournament, Team } from "@shared/schema";
import { ref, get } from "firebase/database";
import { db } from "@/lib/firebase";

export default function TournamentDetail() {
  const { currentUser } = useAuth();
  const [_, setLocation] = useLocation();
  const [match, params] = useRoute<{ id: string }>("/tournament/:id");
  
  // State for countdown timer
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    if (!currentUser) {
      setLocation("/");
    }
  }, [currentUser, setLocation]);

  // Get tournament details
  const { data: tournament, isLoading: tournamentLoading } = useQuery({
    queryKey: ['/api/tournaments', params?.id],
    queryFn: async () => {
      if (!params?.id) return null;
      const snapshot = await get(ref(db, `tournaments/${params.id}`));
      if (snapshot.exists()) {
        return snapshot.val() as Tournament;
      }
      return null;
    },
    enabled: !!params?.id
  });

  // Get registered teams
  const { data: teams, isLoading: teamsLoading } = useQuery({
    queryKey: ['/api/tournaments', params?.id, 'teams'],
    queryFn: async () => {
      if (!params?.id) return [];
      const snapshot = await get(ref(db, `tournaments/${params.id}/teams`));
      if (snapshot.exists()) {
        return Object.values(snapshot.val()) as Team[];
      }
      return [];
    },
    enabled: !!params?.id
  });

  // Countdown timer
  useEffect(() => {
    if (!tournament) return;

    const calculateCountdown = () => {
      const endDate = new Date(tournament.registrationEndDate).getTime();
      const now = new Date().getTime();
      const distance = endDate - now;
      
      if (distance < 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };
    
    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [tournament]);

  if (!match || !params || tournamentLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-dark-surface p-6 rounded-xl text-center">
          <h2 className="text-xl font-bold mb-2 font-rajdhani">Tournament Not Found</h2>
          <p className="text-text-secondary mb-4">The tournament you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => setLocation('/dashboard')} className="gaming-btn bg-primary hover:bg-primary/90">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const progress = Math.round((tournament.participantsCount / tournament.maxParticipants) * 100);

  return (
    <div className="tournament-detail">
      <header className="bg-dark-surface p-4">
        <div className="container mx-auto">
          <div className="flex items-center">
            <button className="mr-3 text-white" onClick={() => setLocation('/dashboard')}>
              <i className="ri-arrow-left-line text-xl"></i>
            </button>
            <h1 className="text-2xl font-bold text-white font-rajdhani">TOURNAMENT DETAILS</h1>
          </div>
        </div>
      </header>

      <div className="p-4 container mx-auto mb-20">
        {/* Tournament Banner */}
        <div className="relative rounded-xl overflow-hidden mb-6 card-glow">
          <div className="w-full h-52 bg-gradient-to-br from-dark-lighter to-dark">
            <svg viewBox="0 0 400 200" className="w-full h-full">
              <rect width="400" height="200" fill="#1E1E1E" />
              <path d="M0 100 Q100 50, 200 100 T400 100" stroke="#FF5500" strokeWidth="3" fill="none" />
              <circle cx="200" cy="100" r="30" fill="#9147FF" fillOpacity="0.3" />
              <circle cx="100" cy="50" r="20" fill="#FF5500" fillOpacity="0.3" />
              <circle cx="300" cy="150" r="25" fill="#FF5500" fillOpacity="0.3" />
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <h2 className="text-2xl font-bold text-white font-rajdhani">{tournament.name}</h2>
            <div className="flex items-center mt-1">
              {tournament.registrationOpen ? (
                <span className="bg-primary text-white text-xs px-2 py-0.5 rounded mr-2">
                  {progress > 70 ? "FILLING FAST" : "OPEN"}
                </span>
              ) : (
                <span className="bg-error text-white text-xs px-2 py-0.5 rounded mr-2">CLOSED</span>
              )}
              <p className="text-sm text-text-secondary">
                {new Date(tournament.startDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        
        {/* Tournament Info */}
        <div className="bg-dark-surface rounded-xl p-5 mb-6">
          <h3 className="text-xl font-bold text-white font-rajdhani mb-4">TOURNAMENT INFO</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-text-secondary text-sm">Format</p>
              <p className="font-medium text-white">{tournament.format}</p>
            </div>
            <div>
              <p className="text-text-secondary text-sm">Entry Fee</p>
              <p className="font-medium text-white">₹{tournament.entryFee}</p>
            </div>
            <div>
              <p className="text-text-secondary text-sm">Team Size</p>
              <p className="font-medium text-white">{tournament.teamSize} Players</p>
            </div>
            <div>
              <p className="text-text-secondary text-sm">Prize Pool</p>
              <p className="font-medium text-white">₹{tournament.prizePool.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-text-secondary text-sm mb-1">Registration Ends</p>
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="bg-dark-lighter rounded p-2 text-center">
                <p className="text-xl font-bold text-white font-rajdhani">{countdown.days.toString().padStart(2, '0')}</p>
                <p className="text-xs text-text-secondary">Days</p>
              </div>
              <div className="bg-dark-lighter rounded p-2 text-center">
                <p className="text-xl font-bold text-white font-rajdhani">{countdown.hours.toString().padStart(2, '0')}</p>
                <p className="text-xs text-text-secondary">Hours</p>
              </div>
              <div className="bg-dark-lighter rounded p-2 text-center">
                <p className="text-xl font-bold text-white font-rajdhani">{countdown.minutes.toString().padStart(2, '0')}</p>
                <p className="text-xs text-text-secondary">Minutes</p>
              </div>
              <div className="bg-dark-lighter rounded p-2 text-center">
                <p className="text-xl font-bold text-white font-rajdhani">{countdown.seconds.toString().padStart(2, '0')}</p>
                <p className="text-xs text-text-secondary">Seconds</p>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-text-secondary text-sm mb-2">Tournament Progress</p>
            <div className="w-full bg-dark-lighter rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1">
              <p className="text-xs text-text-secondary">{tournament.participantsCount}/{tournament.maxParticipants} Teams</p>
              <p className="text-xs text-text-secondary">{progress}% Full</p>
            </div>
          </div>
          
          <Button 
            disabled={!tournament.registrationOpen} 
            className="gaming-btn w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-3 px-4 rounded-lg mt-2 font-rajdhani flex items-center justify-center"
          >
            <i className="ri-user-add-line mr-2"></i> REGISTER YOUR TEAM
          </Button>
        </div>
        
        {/* Rules */}
        <div className="bg-dark-surface rounded-xl p-5 mb-6">
          <h3 className="text-xl font-bold text-white font-rajdhani mb-4">RULES & REGULATIONS</h3>
          
          <div className="space-y-3">
            {tournament.rules.map((rule, index) => (
              <div key={index} className="flex">
                <i className="ri-checkbox-circle-line text-primary text-xl mr-2 flex-shrink-0 mt-0.5"></i>
                <p className="text-text-primary text-sm">{rule}</p>
              </div>
            ))}
          </div>
          
          <button className="text-secondary text-sm font-medium mt-4 flex items-center">
            View Full Rules <i className="ri-arrow-right-line ml-1"></i>
          </button>
        </div>
        
        {/* Registered Teams */}
        <div className="bg-dark-surface rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white font-rajdhani">REGISTERED TEAMS</h3>
            <span className="text-text-secondary text-sm">{tournament.participantsCount}/{tournament.maxParticipants}</span>
          </div>
          
          {teamsLoading ? (
            <div className="p-4 flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : teams && teams.length > 0 ? (
            <>
              {teams.slice(0, 3).map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
              
              <button className="text-secondary text-sm font-medium mt-4 flex items-center mx-auto">
                View All Teams <i className="ri-arrow-right-line ml-1"></i>
              </button>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-text-secondary">No teams have registered yet.</p>
            </div>
          )}
        </div>
      </div>

      <NavBar />
    </div>
  );
}
