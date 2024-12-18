import { AccountList } from "@/components/global/AccountList";
import AutomationItem from "./AutomationItem";
import { useAutomation } from "@/hooks/useAutomation";

 
export default function AutomationList() {

const {optimisticAccounts}=useAutomation()

  return (
    <>
    {optimisticAccounts.length > 0 && (
        <div  className="mt-4">
           {optimisticAccounts
      .filter(account => account.automations.length > 0)
      .map((account) => (
        <AccountList 
          key={account.accountId} 
          username={account.username}
          status={account.status}
        >
          {account.automations.map((automation) => (
            <AutomationItem
              key={automation.id}
               automation={automation}
               />
            ))}
        </AccountList>
      ))
    }
        </div>
      )} 
      </>
  )
}
