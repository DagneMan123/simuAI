
import ChapaPayment from '@/components/employer/ChapaPayment';
import EmployerNavbar from '@/components/employer/EmployerNavbar';

const BillingPage = () => {
  return (
    <div className="space-y-6">
      <EmployerNavbar credits={150} />
      <ChapaPayment />
    </div>
  );
};

export default BillingPage;