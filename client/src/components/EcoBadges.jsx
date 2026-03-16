import React from 'react';
import { Award } from 'lucide-react';

const EcoBadges = ({ achievements }) => {
    if (!achievements || achievements.length === 0) {
        return <p className="text-slate-500">No achievements yet. Keep making eco-friendly choices!</p>;
    }

    return (
        <div className="space-y-4">
            {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-lg">
                    <div className="p-2 bg-yellow-500/20 rounded-full">
                        <Award className="text-yellow-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">{achievement.achievementName}</h3>
                        <p className="text-sm text-slate-400">
                            Earned on {new Date(achievement.dateEarned).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EcoBadges;
