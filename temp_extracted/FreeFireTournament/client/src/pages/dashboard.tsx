import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import NavBar from "@/components/nav-bar";
import TournamentCard from "@/components/tournament-card";
import MatchCard from "@/components/match-card";
import { useAuth } from "@/contexts/auth-context";
import { useLocation } from "wouter";
import { Tournament, Match } from "@shared/schema";
import { ref, get } from "firebase/database";
import { db } from "@/lib/firebase";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [_, setLocation] = useLocation();
  
  useEffect(() => {
    if (!currentUser) {
      setLocation("/");
    }
  }, [currentUser, setLocation]);

  // Fetch tournaments data
  const { data: tournaments, isLoading: tournamentsLoading } = useQuery({
    queryKey: ['/api/tournaments'],
    queryFn: async () => {
      const snapshot = await get(ref(db, 'tournaments'));
      if (snapshot.exists()) {
        return Object.values(snapshot.val()) as Tournament[];
      }
      return [];
    }
  });

  // Fetch recent matches data
  const { data: recentMatches, isLoading: matchesLoading } = useQuery({
    queryKey: ['/api/matches/recent', currentUser?.uid],
    queryFn: async () => {
      if (!currentUser) return [];
      const snapshot = await get(ref(db, `users/${currentUser.uid}/matches`));
      if (snapshot.exists()) {
        return Object.values(snapshot.val()) as Match[];
      }
      return [];
    },
    enabled: !!currentUser
  });

  // Stats for the dashboard
  const stats = {
    tournaments: tournaments?.length || 0,
    matches: recentMatches?.length || 0
  };

  if (!currentUser) return null;

  return (
    <div className="dashboard">
      <header className="bg-dark-surface p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-white font-rajdhani">DASHBOARD</h1>
              <span className="bg-primary text-xs px-2 py-1 rounded text-white">PRO</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative">
                <i className="ri-notification-3-line text-2xl text-white"></i>
                <span className="absolute -top-1 -right-1 bg-error w-4 h-4 rounded-full text-xs flex items-center justify-center">3</span>
              </button>
              <div className="w-8 h-8 rounded-full bg-dark-lighter flex items-center justify-center text-white">
                {currentUser.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 container mx-auto mb-20">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-dark-surface rounded-xl p-4 card-glow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-text-secondary text-sm">Tournaments</h3>
              <i className="ri-trophy-line text-primary"></i>
            </div>
            <p className="text-3xl font-bold text-white font-rajdhani">{stats.tournaments}</p>
            <p className="text-xs text-success flex items-center mt-1">
              <i className="ri-arrow-up-line mr-1"></i> +3 new this week
            </p>
          </div>
          
          <div className="bg-dark-surface rounded-xl p-4 card-glow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-text-secondary text-sm">Matches</h3>
              <i className="ri-sword-line text-primary"></i>
            </div>
            <p className="text-3xl font-bold text-white font-rajdhani">{stats.matches}</p>
            <p className="text-xs text-success flex items-center mt-1">
              <i className="ri-arrow-up-line mr-1"></i> +5 upcoming
            </p>
          </div>
        </div>

        {/* Upcoming Tournament */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white font-rajdhani">UPCOMING TOURNAMENTS</h2>
            <a href="#" className="text-primary text-sm">View All</a>
          </div>
          
          {tournamentsLoading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : tournaments && tournaments.length > 0 ? (
            <>
              {/* Featured tournament */}
              <TournamentCard tournament={tournaments[0]} mode="full" />
              
              {/* Other tournaments */}
              {tournaments.slice(1, 3).map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </>
          ) : (
            <div className="bg-dark-surface rounded-xl p-6 text-center">
              <p className="text-text-secondary">No upcoming tournaments available.</p>
            </div>
          )}
        </div>
        
        {/* Your Recent Matches */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white font-rajdhani">YOUR RECENT MATCHES</h2>
            <a href="#" className="text-primary text-sm">History</a>
          </div>
          
          {matchesLoading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : recentMatches && recentMatches.length > 0 ? (
            recentMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))
          ) : (
            <div className="bg-dark-surface rounded-xl p-6 text-center">
              <p className="text-text-secondary">No recent matches found.</p>
            </div>
          )}
        </div>
      </div>

      <NavBar />
    </div>
  );
}
