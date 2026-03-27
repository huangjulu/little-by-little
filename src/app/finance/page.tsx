import { Suspense } from "react";

import ViewFinance from "@/features/finance/view/ViewFinance";

const FinancePage: React.FC = () => {
  return (
    <Suspense>
      <ViewFinance />
    </Suspense>
  );
};

FinancePage.displayName = "FinancePage";
export default FinancePage;
