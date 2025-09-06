import React from 'react'
import { PartyPopper, Megaphone } from "lucide-react";


export default function UniversityUpdates() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">University Updates</h2>

          <div className="space-y-4">
            <div className="bg-black/30 p-4 rounded-xl shadow">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <PartyPopper size={20} className="text-pink-400" />
                Freshers Party Announced
              </h3>
              <p className="text-sm text-gray-300">
                Join us this Friday for the annual freshers event at the main auditorium.
              </p>
            </div>
            <div className="bg-black/30 p-4 rounded-xl shadow">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Megaphone size={20} className="text-blue-400" />
                Mid-Sem Exams Schedule
              </h3>
              <p className="text-sm text-gray-300">
                The timetable for mid-sems has been released. Check the notice board for details.
              </p>
            </div>
          </div>
    </div>
  )
}
