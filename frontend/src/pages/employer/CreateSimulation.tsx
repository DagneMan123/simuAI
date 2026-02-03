import React from 'react';
import SimulationBuilder from '@/components/employer/SimulationBuilder';
import EmployerNavbar from '@/components/employer/EmployerNavbar';

const CreateSimulationPage = () => {
  return (
    <div className="space-y-6">
      <EmployerNavbar 
        credits={150}
        onCreateSimulation={() => {}}
      />
      <SimulationBuilder />
    </div>
  );
};

export default CreateSimulationPage;