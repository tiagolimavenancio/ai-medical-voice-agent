

import React from 'react';
import {Doctor} from './DoctorACard';
import Image from 'next/image';

type Props = {
  doctorAgent: Doctor;
  setSelectedDoctor: (doctor: Doctor    ) => void;
  isSelected: boolean;
};

function SuggestedDoctorCard({ doctorAgent, setSelectedDoctor, isSelected }: Props) {
  return (
    <div
      onClick={() => setSelectedDoctor(doctorAgent)}
      className={`flex flex-col items-center border-2 rounded-2xl shadow p-5 cursor-pointer transition-all duration-200
        ${isSelected ? 'border-blue-500 ring-2 ring-blue-400' : 'border-gray-300 hover:border-gray-500'}
      `}
    >
      <Image
        src={`${doctorAgent?.image}`}
        alt={doctorAgent?.specialist}
        width={80}
        height={80}
        className="rounded-full mb-2"
      />
      <h3 className="text-lg font-semibold text-center">{doctorAgent?.specialist}</h3>
      <p className="text-sm text-gray-500 text-center">{doctorAgent?.description}</p>
    </div>
  );
}

export default SuggestedDoctorCard;


