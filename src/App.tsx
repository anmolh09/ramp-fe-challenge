import { Fragment, useCallback, useEffect, useContext, useState } from "react";
import { InputSelect } from "./components/InputSelect";
import { Instructions } from "./components/Instructions";
import { Transactions } from "./components/Transactions";
import { useEmployees } from "./hooks/useEmployees";
import { usePaginatedTransactions } from "./hooks/usePaginatedTransactions";
import { useTransactionsByEmployee } from "./hooks/useTransactionsByEmployee";
import { EMPTY_EMPLOYEE } from "./utils/constants";
import { Employee } from "./utils/types";
import { AppContext } from "./utils/context";

export function App() {
  const { data: employees, ...employeeUtils } = useEmployees();
  const {
    data: paginatedTransactions,
    ...paginatedTransactionsUtils
  } = usePaginatedTransactions();
  const {
    data: transactionsByEmployee,
    ...transactionsByEmployeeUtils
  } = useTransactionsByEmployee();
  const [isLoading, setIsLoading] = useState(false);

  const [textValue, setTextValue] = useState(EMPTY_EMPLOYEE);
  // const transactions = useMemo(
  //   () => paginatedTransactions?.data ?? transactionsByEmployee ?? null,
  //   [paginatedTransactions, transactionsByEmployee]
  // )
  const transactions =
    paginatedTransactions?.data ?? transactionsByEmployee ?? null;
  console.log("pag", paginatedTransactions, "emp", transactionsByEmployee);

  const loadAllTransactions = useCallback(async () => {
    setIsLoading(true);
    transactionsByEmployeeUtils.invalidateData();

    await employeeUtils.fetchAll();

    await paginatedTransactionsUtils.fetchAll();
    setIsLoading(false);
  }, [employeeUtils, paginatedTransactionsUtils, transactionsByEmployeeUtils]);

  const loadTransactionsByEmployee = useCallback(
    async (employeeId: string) => {
      paginatedTransactionsUtils.invalidateData();
      await transactionsByEmployeeUtils.fetchById(employeeId);
    },
    [paginatedTransactionsUtils, transactionsByEmployeeUtils]
  );

  useEffect(() => {
    if (employees === null && !employeeUtils.loading) {
      loadAllTransactions();
    }
  }, [employeeUtils.loading, employees, loadAllTransactions]);

  return (
    <Fragment>
      <main className="MainContainer">
        <Instructions />

        <hr className="RampBreak--l" />

        <InputSelect<Employee>
          isLoading={employeeUtils.loading}
          defaultValue={EMPTY_EMPLOYEE}
          items={employees === null ? [] : [EMPTY_EMPLOYEE, ...employees]}
          label="Filter by employee"
          loadingLabel="Loading employees"
          parseItem={(item) => ({
            value: item.id,
            label: `${item.firstName} ${item.lastName}`
          })}
          onChange={async (newValue) => {
            console.log("newval", newValue);
            if (newValue === EMPTY_EMPLOYEE) {
              setTextValue(EMPTY_EMPLOYEE);
              console.log("newval emptyy", newValue);
              await loadAllTransactions();
              return EMPTY_EMPLOYEE;
            }
            setTextValue(newValue);
            await loadTransactionsByEmployee(newValue.id);
          }}
        />

        <div className="RampBreak--l" />

        <div className="RampGrid">
          <Transactions transactions={transactions} />

          {transactions !== null && (
            <button
              className="RampButton"
              hidden={
                paginatedTransactionsUtils.isEnd || textValue !== EMPTY_EMPLOYEE
              }
              disabled={paginatedTransactionsUtils.loading}
              onClick={async () => {
                if (textValue === EMPTY_EMPLOYEE) await loadAllTransactions();
              }}
            >
              View More
            </button>
          )}
        </div>
      </main>
    </Fragment>
  );
}
