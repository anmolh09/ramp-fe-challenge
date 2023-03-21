import { useState } from "react";
import classNames from "classnames";
import { InputCheckbox } from "../InputCheckbox";
import { TransactionPaneComponent } from "./types";

export const TransactionPane: TransactionPaneComponent = ({
  transaction,
  loading,
  setTransactionApproval: consumerSetTransactionApproval
}) => {
  const [approved, setApproved] = useState(transaction.approved);

  return (
    <div className="RampPane">
      <div className="RampPane--content">
        <p className="RampText">{transaction.merchant} </p>
        <b>{moneyFormatter.format(transaction.amount)}</b>
        <p className="RampText--hushed RampText--s">
          {transaction.employee.firstName} {transaction.employee.lastName} -{" "}
          {transaction.date}
        </p>
      </div>
      <div
        className="RampInputCheckbox--container"
        data-testid={transaction.id}
      >
        <label
          className={classNames("RampInputCheckbox--label", {
            "RampInputCheckbox--label-checked": approved,
            "RampInputCheckbox--label-disabled": !approved
          })}
        >
          <input
            id={transaction.id}
            type="checkbox"
            className="RampInputCheckbox--input"
            checked={approved}
            disabled={loading}
            // onClick={() => {
            //   console.log('checked')

            // }}
            onChange={async (e) => {
              // console.log("approved", e);
              setApproved(!approved);
              await consumerSetTransactionApproval({
                transactionId: transaction.id,
                newValue: !approved
              });

              
            }}
          />
        </label>
      </div>
      {/* <InputCheckbox
        id={transaction.id}
        checked={approved}
        disabled={loading}
        // onClick = { () => setApproved(!approved)}
        
        onChange = { async (newValue) => {
          console.log('approved',newValue)
         
          await consumerSetTransactionApproval({
            transactionId: transaction.id,
            newValue
          })
            console.log('approved',newValue)
          setApproved(newValue)
        }}
      /> */}
    </div>
  );
};

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});
