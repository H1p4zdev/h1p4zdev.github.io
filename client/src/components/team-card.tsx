import { Team } from "@shared/schema";

interface TeamCardProps {
  team: Team;
}

export default function TeamCard({ team }: TeamCardProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-dark-lighter">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-dark-lighter flex items-center justify-center mr-3">
          <span className="text-xs text-text-primary">{team.name.substring(0, 2).toUpperCase()}</span>
        </div>
        <div>
          <h4 className="font-medium text-white">{team.name}</h4>
          <p className="text-xs text-text-secondary">{team.tournamentsPlayed} tournaments played</p>
        </div>
      </div>
      <div className="flex items-center">
        {team.badges.map((badge, index) => (
          <div 
            key={index}
            className={`${
              badge === "PRO" ? "bg-success bg-opacity-20 text-success" : 
              badge === "CHAMPION" ? "bg-warning bg-opacity-20 text-warning" : 
              "bg-secondary bg-opacity-20 text-secondary"
            } text-xs px-2 py-1 rounded mr-2`}
          >
            {badge}
          </div>
        ))}
        <i className="ri-more-2-fill text-text-secondary"></i>
      </div>
    </div>
  );
}
