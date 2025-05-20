import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Tournament } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface TournamentCardProps {
  tournament: Tournament;
  mode?: "compact" | "full";
}

export default function TournamentCard({ tournament, mode = "compact" }: TournamentCardProps) {
  const startDate = new Date(tournament.startDate);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(startDate);
  
  const timeUntilStart = formatDistanceToNow(startDate, { addSuffix: true });
  
  // Status badge
  const getStatusBadge = () => {
    if (tournament.registrationOpen) {
      if (tournament.participantsCount / tournament.maxParticipants > 0.7) {
        return <span className="inline-block bg-warning bg-opacity-20 text-warning text-xs px-2 py-1 rounded">FILLING FAST</span>;
      }
      return <span className="inline-block bg-success bg-opacity-20 text-success text-xs px-2 py-1 rounded">OPEN</span>;
    }
    return <span className="inline-block bg-error bg-opacity-20 text-error text-xs px-2 py-1 rounded">CLOSED</span>;
  };

  if (mode === "compact") {
    return (
      <div className="bg-dark-surface rounded-xl p-4 mb-4 card-glow">
        <div className="flex justify-between">
          <div>
            <h3 className="font-bold text-white font-rajdhani">{tournament.name}</h3>
            <p className="text-xs text-text-secondary mt-1 flex items-center">
              <i className="ri-user-line mr-1"></i> {tournament.participantsCount} Players
              <span className="mx-2">•</span>
              <i className="ri-award-line mr-1"></i> ₹{tournament.prizePool.toLocaleString()} Prize
            </p>
          </div>
          <div className="text-right">
            {getStatusBadge()}
            <p className="text-xs text-text-secondary mt-1">Starts: {formattedDate}</p>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex -space-x-2">
            {/* This would need actual participant data */}
            <div className="w-6 h-6 rounded-full bg-dark-lighter border border-dark flex items-center justify-center text-xs">+{tournament.participantsCount}</div>
          </div>
          <Link href={`/tournament/${tournament.id}`}>
            <Button className="gaming-btn bg-secondary text-white text-sm py-1.5 px-4 rounded-lg font-rajdhani">
              JOIN NOW
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Full mode (for featured tournaments)
  return (
    <div className="relative rounded-xl overflow-hidden mb-4 card-glow">
      <div className="relative h-40">
        <svg viewBox="0 0 400 150" className="w-full h-full absolute inset-0">
          <rect width="400" height="150" fill="#1E1E1E" />
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#2D2D2D" strokeWidth="1" />
          </pattern>
          <rect width="400" height="150" fill="url(#grid)" />
          <circle cx="50" cy="50" r="30" fill="#FF5500" fillOpacity="0.1" />
          <circle cx="350" cy="100" r="40" fill="#9147FF" fillOpacity="0.1" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-xl font-bold text-white font-rajdhani">{tournament.name}</h3>
            <p className="text-sm text-text-secondary flex items-center">
              <i className="ri-calendar-line mr-1"></i> {timeUntilStart}
            </p>
          </div>
          <Link href={`/tournament/${tournament.id}`}>
            <Button className="gaming-btn bg-primary text-white text-sm py-2 px-4 rounded-lg font-rajdhani">
              REGISTER
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
