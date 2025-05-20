import { Match } from "@shared/schema";

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  // Determine the badge color and icon based on the position
  const getBadgeContent = () => {
    switch (match.position) {
      case 1:
        return {
          bgColor: "bg-success",
          icon: "ri-trophy-fill",
          text: "Victory Royale"
        };
      case 2:
        return {
          bgColor: "bg-warning",
          icon: "ri-number-2",
          text: "Second Place"
        };
      case 3:
        return {
          bgColor: "bg-warning",
          icon: "ri-number-3",
          text: "Third Place"
        };
      default:
        return {
          bgColor: "bg-error",
          icon: "ri-close-fill",
          text: "Eliminated"
        };
    }
  };

  // Determine points color based on position
  const getPointsColor = () => {
    switch (match.position) {
      case 1:
        return "text-success";
      case 2:
      case 3:
        return "text-warning";
      default:
        return "text-error";
    }
  };

  const badge = getBadgeContent();
  const pointsColor = getPointsColor();
  
  // Format the date
  const matchDate = new Date(match.date);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric"
  }).format(matchDate);

  return (
    <div className="bg-dark-surface rounded-xl p-4 mb-4 card-glow">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full ${badge.bgColor} flex items-center justify-center mr-3`}>
            <i className={`${badge.icon} text-white`}></i>
          </div>
          <div>
            <h3 className="font-bold text-white">{badge.text}</h3>
            <p className="text-xs text-text-secondary">{match.tournamentName} • {formattedDate}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-bold ${pointsColor} text-xl font-rajdhani`}>+{match.pointsEarned}</p>
          <p className="text-xs text-text-secondary">POINTS</p>
        </div>
      </div>
    </div>
  );
}
