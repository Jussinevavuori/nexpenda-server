# Failed calculateDatabaseSteps at 2021-06-28T11:57:21.782Z
## RPC One-Liner
```json
{"id":3,"jsonrpc":"2.0","method":"calculateDatabaseSteps","params":{"projectInfo":"","assumeToBeApplied":[{"tag":"CreateSource","source":"postgresql"},{"tag":"CreateArgument","location":{"tag":"Source","source":"postgresql"},"argument":"provider","value":"\"postgresql\""},{"tag":"CreateArgument","location":{"tag":"Source","source":"postgresql"},"argument":"url","value":"\"***\""},{"tag":"CreateModel","model":"Transaction"},{"tag":"CreateField","model":"Transaction","field":"id","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Transaction","field":"id"},"directive":"id"}},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Transaction","field":"id"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Transaction","field":"id"},"directive":"default"},"argument":"","value":"uuid()"},{"tag":"CreateField","model":"Transaction","field":"uid","type":"String","arity":"Required"},{"tag":"CreateField","model":"Transaction","field":"categoryId","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Transaction","field":"categoryId"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Transaction","field":"categoryId"},"directive":"map"},"argument":"","value":"\"category_id\""},{"tag":"CreateField","model":"Transaction","field":"comment","type":"String","arity":"Optional"},{"tag":"CreateField","model":"Transaction","field":"integerAmount","type":"Int","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Transaction","field":"integerAmount"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Transaction","field":"integerAmount"},"directive":"map"},"argument":"","value":"\"integer_amount\""},{"tag":"CreateField","model":"Transaction","field":"time","type":"DateTime","arity":"Required"},{"tag":"CreateField","model":"Transaction","field":"createdAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Transaction","field":"createdAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Transaction","field":"createdAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Transaction","field":"createdAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Transaction","field":"createdAt"},"directive":"map"},"argument":"","value":"\"created_at\""},{"tag":"CreateField","model":"Transaction","field":"updatedAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Transaction","field":"updatedAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Transaction","field":"updatedAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Transaction","field":"updatedAt"},"directive":"updatedAt"}},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Transaction","field":"updatedAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Transaction","field":"updatedAt"},"directive":"map"},"argument":"","value":"\"updated_at\""},{"tag":"CreateField","model":"Transaction","field":"User","type":"User","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Transaction","field":"User"},"directive":"relation"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Transaction","field":"User"},"directive":"relation"},"argument":"fields","value":"[uid]"},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Transaction","field":"User"},"directive":"relation"},"argument":"references","value":"[id]"},{"tag":"CreateField","model":"Transaction","field":"Category","type":"Category","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Transaction","field":"Category"},"directive":"relation"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Transaction","field":"Category"},"directive":"relation"},"argument":"fields","value":"[categoryId]"},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Transaction","field":"Category"},"directive":"relation"},"argument":"references","value":"[id]"},{"tag":"CreateDirective","location":{"path":{"tag":"Model","model":"Transaction"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Model","model":"Transaction"},"directive":"map"},"argument":"name","value":"\"transactions\""},{"tag":"CreateModel","model":"User"},{"tag":"CreateField","model":"User","field":"id","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"User","field":"id"},"directive":"id"}},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"User","field":"id"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"User","field":"id"},"directive":"default"},"argument":"","value":"uuid()"},{"tag":"CreateField","model":"User","field":"displayName","type":"String","arity":"Optional"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"User","field":"displayName"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"User","field":"displayName"},"directive":"map"},"argument":"","value":"\"display_name\""},{"tag":"CreateField","model":"User","field":"email","type":"String","arity":"Optional"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"User","field":"email"},"directive":"unique"}},{"tag":"CreateField","model":"User","field":"emailVerified","type":"Boolean","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"User","field":"emailVerified"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"User","field":"emailVerified"},"directive":"default"},"argument":"","value":"false"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"User","field":"emailVerified"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"User","field":"emailVerified"},"directive":"map"},"argument":"","value":"\"email_verified\""},{"tag":"CreateField","model":"User","field":"password","type":"String","arity":"Optional"},{"tag":"CreateField","model":"User","field":"googleId","type":"String","arity":"Optional"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"User","field":"googleId"},"directive":"unique"}},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"User","field":"googleId"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"User","field":"googleId"},"directive":"map"},"argument":"","value":"\"google_id\""},{"tag":"CreateField","model":"User","field":"photoUrl","type":"String","arity":"Optional"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"User","field":"photoUrl"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"User","field":"photoUrl"},"directive":"map"},"argument":"","value":"\"photo_url\""},{"tag":"CreateField","model":"User","field":"tokenVersion","type":"Int","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"User","field":"tokenVersion"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"User","field":"tokenVersion"},"directive":"default"},"argument":"","value":"1"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"User","field":"tokenVersion"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"User","field":"tokenVersion"},"directive":"map"},"argument":"","value":"\"token_version\""},{"tag":"CreateField","model":"User","field":"disabled","type":"Boolean","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"User","field":"disabled"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"User","field":"disabled"},"directive":"default"},"argument":"","value":"false"},{"tag":"CreateField","model":"User","field":"isAdmin","type":"Boolean","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"User","field":"isAdmin"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"User","field":"isAdmin"},"directive":"default"},"argument":"","value":"false"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"User","field":"isAdmin"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"User","field":"isAdmin"},"directive":"map"},"argument":"","value":"\"is_admin\""},{"tag":"CreateField","model":"User","field":"themeColor","type":"String","arity":"Optional"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"User","field":"themeColor"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"User","field":"themeColor"},"directive":"map"},"argument":"","value":"\"theme_color\""},{"tag":"CreateField","model":"User","field":"themeMode","type":"String","arity":"Optional"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"User","field":"themeMode"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"User","field":"themeMode"},"directive":"map"},"argument":"","value":"\"theme_mode\""},{"tag":"CreateField","model":"User","field":"createdAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"User","field":"createdAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"User","field":"createdAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"User","field":"createdAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"User","field":"createdAt"},"directive":"map"},"argument":"","value":"\"created_at\""},{"tag":"CreateField","model":"User","field":"updatedAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"User","field":"updatedAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"User","field":"updatedAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"User","field":"updatedAt"},"directive":"updatedAt"}},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"User","field":"updatedAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"User","field":"updatedAt"},"directive":"map"},"argument":"","value":"\"updated_at\""},{"tag":"CreateField","model":"User","field":"stripeCustomerId","type":"String","arity":"Optional"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"User","field":"stripeCustomerId"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"User","field":"stripeCustomerId"},"directive":"map"},"argument":"","value":"\"stripe_customer_id\""},{"tag":"CreateField","model":"User","field":"Transactions","type":"Transaction","arity":"List"},{"tag":"CreateField","model":"User","field":"Categories","type":"Category","arity":"List"},{"tag":"CreateField","model":"User","field":"Budgets","type":"Budget","arity":"List"},{"tag":"CreateField","model":"User","field":"Feedback","type":"Feedback","arity":"List"},{"tag":"CreateField","model":"User","field":"Profile","type":"Profile","arity":"Optional"},{"tag":"CreateField","model":"User","field":"Log","type":"Log","arity":"List"},{"tag":"CreateDirective","location":{"path":{"tag":"Model","model":"User"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Model","model":"User"},"directive":"map"},"argument":"name","value":"\"users\""},{"tag":"CreateModel","model":"Profile"},{"tag":"CreateField","model":"Profile","field":"id","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Profile","field":"id"},"directive":"id"}},{"tag":"CreateField","model":"Profile","field":"uid","type":"String","arity":"Required"},{"tag":"CreateField","model":"Profile","field":"displayName","type":"String","arity":"Optional"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Profile","field":"displayName"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Profile","field":"displayName"},"directive":"map"},"argument":"","value":"\"display_name\""},{"tag":"CreateField","model":"Profile","field":"photoUrl","type":"String","arity":"Optional"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Profile","field":"photoUrl"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Profile","field":"photoUrl"},"directive":"map"},"argument":"","value":"\"photo_url\""},{"tag":"CreateField","model":"Profile","field":"themeColor","type":"String","arity":"Optional"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Profile","field":"themeColor"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Profile","field":"themeColor"},"directive":"map"},"argument":"","value":"\"theme_color\""},{"tag":"CreateField","model":"Profile","field":"themeMode","type":"String","arity":"Optional"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Profile","field":"themeMode"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Profile","field":"themeMode"},"directive":"map"},"argument":"","value":"\"theme_mode\""},{"tag":"CreateField","model":"Profile","field":"User","type":"User","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Profile","field":"User"},"directive":"relation"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Profile","field":"User"},"directive":"relation"},"argument":"fields","value":"[uid]"},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Profile","field":"User"},"directive":"relation"},"argument":"references","value":"[id]"},{"tag":"CreateDirective","location":{"path":{"tag":"Model","model":"Profile"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Model","model":"Profile"},"directive":"map"},"argument":"name","value":"\"profiles\""},{"tag":"CreateModel","model":"Budget"},{"tag":"CreateField","model":"Budget","field":"id","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Budget","field":"id"},"directive":"id"}},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Budget","field":"id"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Budget","field":"id"},"directive":"default"},"argument":"","value":"uuid()"},{"tag":"CreateField","model":"Budget","field":"uid","type":"String","arity":"Required"},{"tag":"CreateField","model":"Budget","field":"label","type":"String","arity":"Optional"},{"tag":"CreateField","model":"Budget","field":"integerAmount","type":"Int","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Budget","field":"integerAmount"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Budget","field":"integerAmount"},"directive":"map"},"argument":"","value":"\"integer_amount\""},{"tag":"CreateField","model":"Budget","field":"createdAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Budget","field":"createdAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Budget","field":"createdAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Budget","field":"createdAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Budget","field":"createdAt"},"directive":"map"},"argument":"","value":"\"created_at\""},{"tag":"CreateField","model":"Budget","field":"updatedAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Budget","field":"updatedAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Budget","field":"updatedAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Budget","field":"updatedAt"},"directive":"updatedAt"}},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Budget","field":"updatedAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Budget","field":"updatedAt"},"directive":"map"},"argument":"","value":"\"updated_at\""},{"tag":"CreateField","model":"Budget","field":"periodMonths","type":"Int","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Budget","field":"periodMonths"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Budget","field":"periodMonths"},"directive":"default"},"argument":"","value":"1"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Budget","field":"periodMonths"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Budget","field":"periodMonths"},"directive":"map"},"argument":"","value":"\"period_months\""},{"tag":"CreateField","model":"Budget","field":"BudgetCategoryInclusions","type":"BudgetCategoryInclusion","arity":"List"},{"tag":"CreateField","model":"Budget","field":"User","type":"User","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Budget","field":"User"},"directive":"relation"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Budget","field":"User"},"directive":"relation"},"argument":"fields","value":"[uid]"},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Budget","field":"User"},"directive":"relation"},"argument":"references","value":"[id]"},{"tag":"CreateDirective","location":{"path":{"tag":"Model","model":"Budget"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Model","model":"Budget"},"directive":"map"},"argument":"name","value":"\"budgets\""},{"tag":"CreateModel","model":"BudgetCategoryInclusion"},{"tag":"CreateField","model":"BudgetCategoryInclusion","field":"budgetId","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"BudgetCategoryInclusion","field":"budgetId"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"BudgetCategoryInclusion","field":"budgetId"},"directive":"map"},"argument":"","value":"\"budget_id\""},{"tag":"CreateField","model":"BudgetCategoryInclusion","field":"categoryId","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"BudgetCategoryInclusion","field":"categoryId"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"BudgetCategoryInclusion","field":"categoryId"},"directive":"map"},"argument":"","value":"\"category_id\""},{"tag":"CreateField","model":"BudgetCategoryInclusion","field":"Budget","type":"Budget","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"BudgetCategoryInclusion","field":"Budget"},"directive":"relation"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"BudgetCategoryInclusion","field":"Budget"},"directive":"relation"},"argument":"fields","value":"[budgetId]"},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"BudgetCategoryInclusion","field":"Budget"},"directive":"relation"},"argument":"references","value":"[id]"},{"tag":"CreateField","model":"BudgetCategoryInclusion","field":"Category","type":"Category","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"BudgetCategoryInclusion","field":"Category"},"directive":"relation"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"BudgetCategoryInclusion","field":"Category"},"directive":"relation"},"argument":"fields","value":"[categoryId]"},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"BudgetCategoryInclusion","field":"Category"},"directive":"relation"},"argument":"references","value":"[id]"},{"tag":"CreateDirective","location":{"path":{"tag":"Model","model":"BudgetCategoryInclusion"},"directive":"id"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Model","model":"BudgetCategoryInclusion"},"directive":"id"},"argument":"","value":"[categoryId, budgetId]"},{"tag":"CreateModel","model":"Category"},{"tag":"CreateField","model":"Category","field":"id","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Category","field":"id"},"directive":"id"}},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Category","field":"id"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Category","field":"id"},"directive":"default"},"argument":"","value":"uuid()"},{"tag":"CreateField","model":"Category","field":"uid","type":"String","arity":"Required"},{"tag":"CreateField","model":"Category","field":"value","type":"String","arity":"Required"},{"tag":"CreateField","model":"Category","field":"icon","type":"String","arity":"Optional"},{"tag":"CreateField","model":"Category","field":"createdAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Category","field":"createdAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Category","field":"createdAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Category","field":"createdAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Category","field":"createdAt"},"directive":"map"},"argument":"","value":"\"created_at\""},{"tag":"CreateField","model":"Category","field":"updatedAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Category","field":"updatedAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Category","field":"updatedAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Category","field":"updatedAt"},"directive":"updatedAt"}},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Category","field":"updatedAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Category","field":"updatedAt"},"directive":"map"},"argument":"","value":"\"updated_at\""},{"tag":"CreateField","model":"Category","field":"Transactions","type":"Transaction","arity":"List"},{"tag":"CreateField","model":"Category","field":"BudgetCategoryInclusions","type":"BudgetCategoryInclusion","arity":"List"},{"tag":"CreateField","model":"Category","field":"User","type":"User","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Category","field":"User"},"directive":"relation"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Category","field":"User"},"directive":"relation"},"argument":"fields","value":"[uid]"},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Category","field":"User"},"directive":"relation"},"argument":"references","value":"[id]"},{"tag":"CreateDirective","location":{"path":{"tag":"Model","model":"Category"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Model","model":"Category"},"directive":"map"},"argument":"name","value":"\"categories\""},{"tag":"CreateDirective","location":{"path":{"tag":"Model","model":"Category","arguments":[{"name":"","value":"[uid, value]"},{"name":"name","value":"\"unique_uid_value\""}]},"directive":"unique"}},{"tag":"CreateDirective","location":{"path":{"tag":"Model","model":"Category","arguments":[{"name":"","value":"[uid, id]"},{"name":"name","value":"\"unique_uid_id\""}]},"directive":"unique"}},{"tag":"CreateModel","model":"Feedback"},{"tag":"CreateField","model":"Feedback","field":"id","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Feedback","field":"id"},"directive":"id"}},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Feedback","field":"id"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Feedback","field":"id"},"directive":"default"},"argument":"","value":"uuid()"},{"tag":"CreateField","model":"Feedback","field":"uid","type":"String","arity":"Required"},{"tag":"CreateField","model":"Feedback","field":"message","type":"String","arity":"Optional"},{"tag":"CreateField","model":"Feedback","field":"User","type":"User","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Feedback","field":"User"},"directive":"relation"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Feedback","field":"User"},"directive":"relation"},"argument":"fields","value":"[uid]"},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Feedback","field":"User"},"directive":"relation"},"argument":"references","value":"[id]"},{"tag":"CreateModel","model":"Log"},{"tag":"CreateField","model":"Log","field":"id","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Log","field":"id"},"directive":"id"}},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Log","field":"id"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Log","field":"id"},"directive":"default"},"argument":"","value":"uuid()"},{"tag":"CreateField","model":"Log","field":"uid","type":"String","arity":"Optional"},{"tag":"CreateField","model":"Log","field":"type","type":"String","arity":"Required"},{"tag":"CreateField","model":"Log","field":"message","type":"String","arity":"Required"},{"tag":"CreateField","model":"Log","field":"data","type":"String","arity":"Required"},{"tag":"CreateField","model":"Log","field":"stackTrace","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Log","field":"stackTrace"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Log","field":"stackTrace"},"directive":"map"},"argument":"","value":"\"stack_trace\""},{"tag":"CreateField","model":"Log","field":"device","type":"String","arity":"Required"},{"tag":"CreateField","model":"Log","field":"timestamp","type":"Int","arity":"Required"},{"tag":"CreateField","model":"Log","field":"timestring","type":"String","arity":"Required"},{"tag":"CreateField","model":"Log","field":"createdAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Log","field":"createdAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Log","field":"createdAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Log","field":"createdAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Log","field":"createdAt"},"directive":"map"},"argument":"","value":"\"created_at\""},{"tag":"CreateField","model":"Log","field":"href","type":"String","arity":"Required"},{"tag":"CreateField","model":"Log","field":"User","type":"User","arity":"Optional"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Log","field":"User"},"directive":"relation"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Log","field":"User"},"directive":"relation"},"argument":"fields","value":"[uid]"},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Log","field":"User"},"directive":"relation"},"argument":"references","value":"[id]"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Profile","field":"id"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Profile","field":"id"},"directive":"default"},"argument":"","value":"uuid()"},{"tag":"DeleteField","model":"Profile","field":"id"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Profile","field":"uid"},"directive":"id"}},{"tag":"DeleteField","model":"User","field":"displayName"},{"tag":"DeleteField","model":"User","field":"photoUrl"},{"tag":"DeleteField","model":"User","field":"themeColor"},{"tag":"DeleteField","model":"User","field":"themeMode"},{"tag":"CreateModel","model":"Config"},{"tag":"CreateField","model":"Config","field":"key","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Config","field":"key"},"directive":"id"}},{"tag":"CreateField","model":"Config","field":"value","type":"String","arity":"Required"},{"tag":"CreateField","model":"Profile","field":"googlePhotoUrl","type":"String","arity":"Optional"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Profile","field":"googlePhotoUrl"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Profile","field":"googlePhotoUrl"},"directive":"map"},"argument":"","value":"\"google_photo_url\""},{"tag":"CreateModel","model":"TransactionRecurrence"},{"tag":"CreateField","model":"TransactionRecurrence","field":"id","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionRecurrence","field":"id"},"directive":"id"}},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionRecurrence","field":"id"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionRecurrence","field":"id"},"directive":"default"},"argument":"","value":"uuid()"},{"tag":"CreateField","model":"TransactionRecurrence","field":"uid","type":"String","arity":"Required"},{"tag":"CreateField","model":"TransactionRecurrence","field":"categoryId","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionRecurrence","field":"categoryId"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionRecurrence","field":"categoryId"},"directive":"map"},"argument":"","value":"\"category_id\""},{"tag":"CreateField","model":"TransactionRecurrence","field":"comment","type":"String","arity":"Optional"},{"tag":"CreateField","model":"TransactionRecurrence","field":"integerAmount","type":"Int","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionRecurrence","field":"integerAmount"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionRecurrence","field":"integerAmount"},"directive":"map"},"argument":"","value":"\"integer_amount\""},{"tag":"CreateField","model":"TransactionRecurrence","field":"createdAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionRecurrence","field":"createdAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionRecurrence","field":"createdAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionRecurrence","field":"createdAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionRecurrence","field":"createdAt"},"directive":"map"},"argument":"","value":"\"created_at\""},{"tag":"CreateField","model":"TransactionRecurrence","field":"updatedAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionRecurrence","field":"updatedAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionRecurrence","field":"updatedAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionRecurrence","field":"updatedAt"},"directive":"updatedAt"}},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionRecurrence","field":"updatedAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionRecurrence","field":"updatedAt"},"directive":"map"},"argument":"","value":"\"updated_at\""},{"tag":"CreateField","model":"TransactionRecurrence","field":"User","type":"User","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionRecurrence","field":"User"},"directive":"relation"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionRecurrence","field":"User"},"directive":"relation"},"argument":"fields","value":"[uid]"},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionRecurrence","field":"User"},"directive":"relation"},"argument":"references","value":"[id]"},{"tag":"CreateField","model":"TransactionRecurrence","field":"Category","type":"Category","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionRecurrence","field":"Category"},"directive":"relation"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionRecurrence","field":"Category"},"directive":"relation"},"argument":"fields","value":"[categoryId]"},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionRecurrence","field":"Category"},"directive":"relation"},"argument":"references","value":"[id]"},{"tag":"CreateDirective","location":{"path":{"tag":"Model","model":"TransactionRecurrence"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Model","model":"TransactionRecurrence"},"directive":"map"},"argument":"name","value":"\"transaction_recurrences\""},{"tag":"CreateField","model":"User","field":"TransactionRecurrence","type":"TransactionRecurrence","arity":"List"},{"tag":"CreateField","model":"Category","field":"TransactionRecurrence","type":"TransactionRecurrence","arity":"List"},{"tag":"CreateEnum","enum":"IntervalType","values":["DAY","WEEK","MONTH","YEAR"]},{"tag":"CreateField","model":"Transaction","field":"recurrenceId","type":"String","arity":"Optional"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Transaction","field":"recurrenceId"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Transaction","field":"recurrenceId"},"directive":"map"},"argument":"","value":"\"recurrence_id\""},{"tag":"CreateField","model":"Transaction","field":"Recurrence","type":"TransactionRecurrence","arity":"Optional"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Transaction","field":"Recurrence"},"directive":"relation"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Transaction","field":"Recurrence"},"directive":"relation"},"argument":"fields","value":"[recurrenceId]"},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Transaction","field":"Recurrence"},"directive":"relation"},"argument":"references","value":"[id]"},{"tag":"CreateField","model":"User","field":"TransactionRecurrences","type":"TransactionRecurrence","arity":"List"},{"tag":"DeleteField","model":"User","field":"TransactionRecurrence"},{"tag":"CreateField","model":"TransactionRecurrence","field":"intervalType","type":"IntervalType","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionRecurrence","field":"intervalType"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionRecurrence","field":"intervalType"},"directive":"map"},"argument":"","value":"\"interval_type\""},{"tag":"CreateField","model":"TransactionRecurrence","field":"intervalLength","type":"Int","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionRecurrence","field":"intervalLength"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionRecurrence","field":"intervalLength"},"directive":"map"},"argument":"","value":"\"interval_length\""},{"tag":"CreateField","model":"TransactionRecurrence","field":"firstOccurence","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionRecurrence","field":"firstOccurence"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionRecurrence","field":"firstOccurence"},"directive":"map"},"argument":"","value":"\"first_occurence\""},{"tag":"CreateField","model":"TransactionRecurrence","field":"lastOccurence","type":"DateTime","arity":"Optional"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionRecurrence","field":"lastOccurence"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionRecurrence","field":"lastOccurence"},"directive":"map"},"argument":"","value":"\"last_occurence\""},{"tag":"CreateField","model":"TransactionRecurrence","field":"Transaction","type":"Transaction","arity":"List"},{"tag":"CreateModel","model":"TransactionSchedule"},{"tag":"CreateField","model":"TransactionSchedule","field":"id","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionSchedule","field":"id"},"directive":"id"}},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionSchedule","field":"id"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionSchedule","field":"id"},"directive":"default"},"argument":"","value":"uuid()"},{"tag":"CreateField","model":"TransactionSchedule","field":"uid","type":"String","arity":"Required"},{"tag":"CreateField","model":"TransactionSchedule","field":"categoryId","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionSchedule","field":"categoryId"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionSchedule","field":"categoryId"},"directive":"map"},"argument":"","value":"\"category_id\""},{"tag":"CreateField","model":"TransactionSchedule","field":"comment","type":"String","arity":"Optional"},{"tag":"CreateField","model":"TransactionSchedule","field":"integerAmount","type":"Int","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionSchedule","field":"integerAmount"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionSchedule","field":"integerAmount"},"directive":"map"},"argument":"","value":"\"integer_amount\""},{"tag":"CreateField","model":"TransactionSchedule","field":"intervalType","type":"IntervalType","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionSchedule","field":"intervalType"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionSchedule","field":"intervalType"},"directive":"map"},"argument":"","value":"\"interval_type\""},{"tag":"CreateField","model":"TransactionSchedule","field":"intervalLength","type":"Int","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionSchedule","field":"intervalLength"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionSchedule","field":"intervalLength"},"directive":"map"},"argument":"","value":"\"interval_length\""},{"tag":"CreateField","model":"TransactionSchedule","field":"firstOccurrence","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionSchedule","field":"firstOccurrence"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionSchedule","field":"firstOccurrence"},"directive":"map"},"argument":"","value":"\"first_occurrence\""},{"tag":"CreateField","model":"TransactionSchedule","field":"lastOccurrence","type":"DateTime","arity":"Optional"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionSchedule","field":"lastOccurrence"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionSchedule","field":"lastOccurrence"},"directive":"map"},"argument":"","value":"\"last_occurrence\""},{"tag":"CreateField","model":"TransactionSchedule","field":"createdAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionSchedule","field":"createdAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionSchedule","field":"createdAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionSchedule","field":"createdAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionSchedule","field":"createdAt"},"directive":"map"},"argument":"","value":"\"created_at\""},{"tag":"CreateField","model":"TransactionSchedule","field":"updatedAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionSchedule","field":"updatedAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionSchedule","field":"updatedAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionSchedule","field":"updatedAt"},"directive":"updatedAt"}},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionSchedule","field":"updatedAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionSchedule","field":"updatedAt"},"directive":"map"},"argument":"","value":"\"updated_at\""},{"tag":"CreateField","model":"TransactionSchedule","field":"User","type":"User","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionSchedule","field":"User"},"directive":"relation"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionSchedule","field":"User"},"directive":"relation"},"argument":"fields","value":"[uid]"},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionSchedule","field":"User"},"directive":"relation"},"argument":"references","value":"[id]"},{"tag":"CreateField","model":"TransactionSchedule","field":"Category","type":"Category","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionSchedule","field":"Category"},"directive":"relation"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionSchedule","field":"Category"},"directive":"relation"},"argument":"fields","value":"[categoryId]"},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionSchedule","field":"Category"},"directive":"relation"},"argument":"references","value":"[id]"},{"tag":"CreateField","model":"TransactionSchedule","field":"Transaction","type":"Transaction","arity":"List"},{"tag":"CreateDirective","location":{"path":{"tag":"Model","model":"TransactionSchedule"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Model","model":"TransactionSchedule"},"directive":"map"},"argument":"name","value":"\"transaction_schedules\""},{"tag":"DeleteModel","model":"TransactionRecurrence"},{"tag":"CreateField","model":"Transaction","field":"scheduleId","type":"String","arity":"Optional"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Transaction","field":"scheduleId"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Transaction","field":"scheduleId"},"directive":"map"},"argument":"","value":"\"schedule_id\""},{"tag":"CreateField","model":"Transaction","field":"Schedule","type":"TransactionSchedule","arity":"Optional"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Transaction","field":"Schedule"},"directive":"relation"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Transaction","field":"Schedule"},"directive":"relation"},"argument":"fields","value":"[scheduleId]"},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Transaction","field":"Schedule"},"directive":"relation"},"argument":"references","value":"[id]"},{"tag":"DeleteField","model":"Transaction","field":"recurrenceId"},{"tag":"DeleteField","model":"Transaction","field":"Recurrence"},{"tag":"CreateField","model":"User","field":"TransactionSchedule","type":"TransactionSchedule","arity":"List"},{"tag":"DeleteField","model":"User","field":"TransactionRecurrences"},{"tag":"CreateField","model":"Category","field":"TransactionSchedule","type":"TransactionSchedule","arity":"List"},{"tag":"DeleteField","model":"Category","field":"TransactionRecurrence"},{"tag":"CreateField","model":"Profile","field":"createdAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Profile","field":"createdAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Profile","field":"createdAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Profile","field":"createdAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Profile","field":"createdAt"},"directive":"map"},"argument":"","value":"\"created_at\""},{"tag":"CreateField","model":"Profile","field":"updatedAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Profile","field":"updatedAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Profile","field":"updatedAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Profile","field":"updatedAt"},"directive":"updatedAt"}},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Profile","field":"updatedAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Profile","field":"updatedAt"},"directive":"map"},"argument":"","value":"\"updated_at\""},{"tag":"CreateField","model":"TransactionSchedule","field":"occurrences","type":"Int","arity":"Required"},{"tag":"DeleteField","model":"TransactionSchedule","field":"lastOccurrence"},{"tag":"CreateField","model":"TransactionSchedule","field":"Transactions","type":"Transaction","arity":"List"},{"tag":"DeleteField","model":"TransactionSchedule","field":"Transaction"},{"tag":"UpdateField","model":"TransactionSchedule","field":"occurrences","arity":"Optional"},{"tag":"CreateField","model":"TransactionSchedule","field":"intervalEvery","type":"Int","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionSchedule","field":"intervalEvery"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionSchedule","field":"intervalEvery"},"directive":"default"},"argument":"","value":"1"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionSchedule","field":"intervalEvery"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionSchedule","field":"intervalEvery"},"directive":"map"},"argument":"","value":"\"interval_every\""},{"tag":"DeleteField","model":"TransactionSchedule","field":"intervalLength"},{"tag":"CreateField","model":"TransactionSchedule","field":"latestCreatedOccurrence","type":"DateTime","arity":"Optional"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"TransactionSchedule","field":"latestCreatedOccurrence"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"TransactionSchedule","field":"latestCreatedOccurrence"},"directive":"map"},"argument":"","value":"\"latest_created_occurrence\""},{"tag":"CreateEnum","enum":"SubscribableProduct","values":["PREMIUM"]},{"tag":"CreateModel","model":"Subscription"},{"tag":"CreateField","model":"Subscription","field":"id","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Subscription","field":"id"},"directive":"id"}},{"tag":"CreateField","model":"Subscription","field":"uid","type":"String","arity":"Required"},{"tag":"CreateField","model":"Subscription","field":"product","type":"SubscribableProduct","arity":"Required"},{"tag":"CreateField","model":"Subscription","field":"currentPeriodEnd","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Subscription","field":"currentPeriodEnd"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Subscription","field":"currentPeriodEnd"},"directive":"map"},"argument":"","value":"\"current_period_end\""},{"tag":"CreateField","model":"Subscription","field":"createdAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Subscription","field":"createdAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Subscription","field":"createdAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Subscription","field":"createdAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Subscription","field":"createdAt"},"directive":"map"},"argument":"","value":"\"created_at\""},{"tag":"CreateField","model":"Subscription","field":"updatedAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Subscription","field":"updatedAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Subscription","field":"updatedAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Subscription","field":"updatedAt"},"directive":"updatedAt"}},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Subscription","field":"updatedAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Subscription","field":"updatedAt"},"directive":"map"},"argument":"","value":"\"updated_at\""},{"tag":"CreateField","model":"Subscription","field":"User","type":"User","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Subscription","field":"User"},"directive":"relation"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Subscription","field":"User"},"directive":"relation"},"argument":"fields","value":"[uid]"},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Subscription","field":"User"},"directive":"relation"},"argument":"references","value":"[id]"},{"tag":"CreateDirective","location":{"path":{"tag":"Model","model":"Subscription"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Model","model":"Subscription"},"directive":"map"},"argument":"name","value":"\"subscriptions\""},{"tag":"CreateField","model":"User","field":"Subscription","type":"Subscription","arity":"Optional"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Subscription","field":"uid"},"directive":"unique"}},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Subscription","field":"id"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Subscription","field":"id"},"directive":"default"},"argument":"","value":"uuid()"},{"tag":"CreateModel","model":"Product"},{"tag":"CreateField","model":"Product","field":"id","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Product","field":"id"},"directive":"id"}},{"tag":"CreateField","model":"Product","field":"active","type":"Boolean","arity":"Required"},{"tag":"CreateField","model":"Product","field":"description","type":"String","arity":"Required"},{"tag":"CreateField","model":"Product","field":"name","type":"String","arity":"Required"},{"tag":"CreateField","model":"Product","field":"createdAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Product","field":"createdAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Product","field":"createdAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Product","field":"createdAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Product","field":"createdAt"},"directive":"map"},"argument":"","value":"\"created_at\""},{"tag":"CreateField","model":"Product","field":"updatedAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Product","field":"updatedAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Product","field":"updatedAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Product","field":"updatedAt"},"directive":"updatedAt"}},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"Product","field":"updatedAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"Product","field":"updatedAt"},"directive":"map"},"argument":"","value":"\"updated_at\""},{"tag":"CreateField","model":"Product","field":"ProductPrice","type":"ProductPrice","arity":"List"},{"tag":"CreateDirective","location":{"path":{"tag":"Model","model":"Product"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Model","model":"Product"},"directive":"map"},"argument":"name","value":"\"products\""},{"tag":"CreateModel","model":"ProductPrice"},{"tag":"CreateField","model":"ProductPrice","field":"id","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"ProductPrice","field":"id"},"directive":"id"}},{"tag":"CreateField","model":"ProductPrice","field":"productId","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"ProductPrice","field":"productId"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"ProductPrice","field":"productId"},"directive":"map"},"argument":"","value":"\"product_id\""},{"tag":"CreateField","model":"ProductPrice","field":"active","type":"Boolean","arity":"Required"},{"tag":"CreateField","model":"ProductPrice","field":"currency","type":"String","arity":"Required"},{"tag":"CreateField","model":"ProductPrice","field":"nickname","type":"String","arity":"Required"},{"tag":"CreateField","model":"ProductPrice","field":"type","type":"String","arity":"Required"},{"tag":"CreateField","model":"ProductPrice","field":"recurringInterval","type":"IntervalType","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"ProductPrice","field":"recurringInterval"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"ProductPrice","field":"recurringInterval"},"directive":"map"},"argument":"","value":"\"recurring_interval\""},{"tag":"CreateField","model":"ProductPrice","field":"createdAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"ProductPrice","field":"createdAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"ProductPrice","field":"createdAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"ProductPrice","field":"createdAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"ProductPrice","field":"createdAt"},"directive":"map"},"argument":"","value":"\"created_at\""},{"tag":"CreateField","model":"ProductPrice","field":"updatedAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"ProductPrice","field":"updatedAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"ProductPrice","field":"updatedAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"ProductPrice","field":"updatedAt"},"directive":"updatedAt"}},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"ProductPrice","field":"updatedAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"ProductPrice","field":"updatedAt"},"directive":"map"},"argument":"","value":"\"updated_at\""},{"tag":"CreateField","model":"ProductPrice","field":"Product","type":"Product","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"ProductPrice","field":"Product"},"directive":"relation"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"ProductPrice","field":"Product"},"directive":"relation"},"argument":"fields","value":"[productId]"},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"ProductPrice","field":"Product"},"directive":"relation"},"argument":"references","value":"[id]"},{"tag":"CreateDirective","location":{"path":{"tag":"Model","model":"ProductPrice"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Model","model":"ProductPrice"},"directive":"map"},"argument":"name","value":"\"product_prices\""},{"tag":"UpdateField","model":"Subscription","field":"currentPeriodEnd","arity":"Optional"},{"tag":"UpdateField","model":"ProductPrice","field":"recurringInterval","type":"String"},{"tag":"CreateModel","model":"StripeProduct"},{"tag":"CreateField","model":"StripeProduct","field":"id","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"StripeProduct","field":"id"},"directive":"id"}},{"tag":"CreateField","model":"StripeProduct","field":"active","type":"Boolean","arity":"Required"},{"tag":"CreateField","model":"StripeProduct","field":"description","type":"String","arity":"Required"},{"tag":"CreateField","model":"StripeProduct","field":"name","type":"String","arity":"Required"},{"tag":"CreateField","model":"StripeProduct","field":"createdAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"StripeProduct","field":"createdAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"StripeProduct","field":"createdAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"StripeProduct","field":"createdAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"StripeProduct","field":"createdAt"},"directive":"map"},"argument":"","value":"\"created_at\""},{"tag":"CreateField","model":"StripeProduct","field":"updatedAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"StripeProduct","field":"updatedAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"StripeProduct","field":"updatedAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"StripeProduct","field":"updatedAt"},"directive":"updatedAt"}},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"StripeProduct","field":"updatedAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"StripeProduct","field":"updatedAt"},"directive":"map"},"argument":"","value":"\"updated_at\""},{"tag":"CreateField","model":"StripeProduct","field":"ProductPrice","type":"StripePrice","arity":"List"},{"tag":"CreateDirective","location":{"path":{"tag":"Model","model":"StripeProduct"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Model","model":"StripeProduct"},"directive":"map"},"argument":"name","value":"\"stripe_products\""},{"tag":"CreateModel","model":"StripePrice"},{"tag":"CreateField","model":"StripePrice","field":"id","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"StripePrice","field":"id"},"directive":"id"}},{"tag":"CreateField","model":"StripePrice","field":"productId","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"StripePrice","field":"productId"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"StripePrice","field":"productId"},"directive":"map"},"argument":"","value":"\"product_id\""},{"tag":"CreateField","model":"StripePrice","field":"active","type":"Boolean","arity":"Required"},{"tag":"CreateField","model":"StripePrice","field":"currency","type":"String","arity":"Required"},{"tag":"CreateField","model":"StripePrice","field":"nickname","type":"String","arity":"Required"},{"tag":"CreateField","model":"StripePrice","field":"type","type":"String","arity":"Required"},{"tag":"CreateField","model":"StripePrice","field":"recurringInterval","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"StripePrice","field":"recurringInterval"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"StripePrice","field":"recurringInterval"},"directive":"map"},"argument":"","value":"\"recurring_interval\""},{"tag":"CreateField","model":"StripePrice","field":"createdAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"StripePrice","field":"createdAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"StripePrice","field":"createdAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"StripePrice","field":"createdAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"StripePrice","field":"createdAt"},"directive":"map"},"argument":"","value":"\"created_at\""},{"tag":"CreateField","model":"StripePrice","field":"updatedAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"StripePrice","field":"updatedAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"StripePrice","field":"updatedAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"StripePrice","field":"updatedAt"},"directive":"updatedAt"}},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"StripePrice","field":"updatedAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"StripePrice","field":"updatedAt"},"directive":"map"},"argument":"","value":"\"updated_at\""},{"tag":"CreateField","model":"StripePrice","field":"Product","type":"StripeProduct","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"StripePrice","field":"Product"},"directive":"relation"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"StripePrice","field":"Product"},"directive":"relation"},"argument":"fields","value":"[productId]"},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"StripePrice","field":"Product"},"directive":"relation"},"argument":"references","value":"[id]"},{"tag":"CreateDirective","location":{"path":{"tag":"Model","model":"StripePrice"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Model","model":"StripePrice"},"directive":"map"},"argument":"name","value":"\"stripe_prices\""},{"tag":"DeleteModel","model":"Product"},{"tag":"DeleteModel","model":"ProductPrice"},{"tag":"UpdateField","model":"StripePrice","field":"nickname","arity":"Optional"},{"tag":"UpdateField","model":"StripePrice","field":"recurringInterval","arity":"Optional"},{"tag":"CreateModel","model":"UserSubscription"},{"tag":"CreateField","model":"UserSubscription","field":"id","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"UserSubscription","field":"id"},"directive":"id"}},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"UserSubscription","field":"id"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"UserSubscription","field":"id"},"directive":"default"},"argument":"","value":"uuid()"},{"tag":"CreateField","model":"UserSubscription","field":"uid","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"UserSubscription","field":"uid"},"directive":"unique"}},{"tag":"CreateField","model":"UserSubscription","field":"product","type":"SubscribableProduct","arity":"Required"},{"tag":"CreateField","model":"UserSubscription","field":"currentPeriodEnd","type":"DateTime","arity":"Optional"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"UserSubscription","field":"currentPeriodEnd"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"UserSubscription","field":"currentPeriodEnd"},"directive":"map"},"argument":"","value":"\"current_period_end\""},{"tag":"CreateField","model":"UserSubscription","field":"createdAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"UserSubscription","field":"createdAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"UserSubscription","field":"createdAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"UserSubscription","field":"createdAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"UserSubscription","field":"createdAt"},"directive":"map"},"argument":"","value":"\"created_at\""},{"tag":"CreateField","model":"UserSubscription","field":"updatedAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"UserSubscription","field":"updatedAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"UserSubscription","field":"updatedAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"UserSubscription","field":"updatedAt"},"directive":"updatedAt"}},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"UserSubscription","field":"updatedAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"UserSubscription","field":"updatedAt"},"directive":"map"},"argument":"","value":"\"updated_at\""},{"tag":"CreateField","model":"UserSubscription","field":"User","type":"User","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"UserSubscription","field":"User"},"directive":"relation"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"UserSubscription","field":"User"},"directive":"relation"},"argument":"fields","value":"[uid]"},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"UserSubscription","field":"User"},"directive":"relation"},"argument":"references","value":"[id]"},{"tag":"CreateDirective","location":{"path":{"tag":"Model","model":"UserSubscription"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Model","model":"UserSubscription"},"directive":"map"},"argument":"name","value":"\"subscriptions\""},{"tag":"DeleteModel","model":"Subscription"},{"tag":"UpdateField","model":"User","field":"Subscription","type":"UserSubscription"},{"tag":"CreateModel","model":"PremiumPrice"},{"tag":"CreateField","model":"PremiumPrice","field":"id","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"PremiumPrice","field":"id"},"directive":"id"}},{"tag":"CreateField","model":"PremiumPrice","field":"productId","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"PremiumPrice","field":"productId"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"PremiumPrice","field":"productId"},"directive":"map"},"argument":"","value":"\"product_id\""},{"tag":"CreateField","model":"PremiumPrice","field":"active","type":"Boolean","arity":"Required"},{"tag":"CreateField","model":"PremiumPrice","field":"currency","type":"String","arity":"Required"},{"tag":"CreateField","model":"PremiumPrice","field":"nickname","type":"String","arity":"Optional"},{"tag":"CreateField","model":"PremiumPrice","field":"type","type":"String","arity":"Required"},{"tag":"CreateField","model":"PremiumPrice","field":"recurringInterval","type":"String","arity":"Optional"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"PremiumPrice","field":"recurringInterval"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"PremiumPrice","field":"recurringInterval"},"directive":"map"},"argument":"","value":"\"recurring_interval\""},{"tag":"CreateField","model":"PremiumPrice","field":"createdAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"PremiumPrice","field":"createdAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"PremiumPrice","field":"createdAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"PremiumPrice","field":"createdAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"PremiumPrice","field":"createdAt"},"directive":"map"},"argument":"","value":"\"created_at\""},{"tag":"CreateField","model":"PremiumPrice","field":"updatedAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"PremiumPrice","field":"updatedAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"PremiumPrice","field":"updatedAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"PremiumPrice","field":"updatedAt"},"directive":"updatedAt"}},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"PremiumPrice","field":"updatedAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"PremiumPrice","field":"updatedAt"},"directive":"map"},"argument":"","value":"\"updated_at\""},{"tag":"CreateDirective","location":{"path":{"tag":"Model","model":"PremiumPrice"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Model","model":"PremiumPrice"},"directive":"map"},"argument":"name","value":"\"premium_prices\""},{"tag":"CreateField","model":"PremiumPrice","field":"recurringIntervalCount","type":"Int","arity":"Optional"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"PremiumPrice","field":"recurringIntervalCount"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"PremiumPrice","field":"recurringIntervalCount"},"directive":"map"},"argument":"","value":"\"recurring_interval_count\""},{"tag":"CreateField","model":"PremiumPrice","field":"unitAmount","type":"Int","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"PremiumPrice","field":"unitAmount"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"PremiumPrice","field":"unitAmount"},"directive":"map"},"argument":"","value":"\"unit_amount\""},{"tag":"CreateField","model":"PremiumPrice","field":"unitAmountDecimal","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"PremiumPrice","field":"unitAmountDecimal"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"PremiumPrice","field":"unitAmountDecimal"},"directive":"map"},"argument":"","value":"\"unit_amount_decimal\""},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"PremiumPrice","field":"unitAmount"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"PremiumPrice","field":"unitAmount"},"directive":"default"},"argument":"","value":"1"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"PremiumPrice","field":"unitAmountDecimal"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"PremiumPrice","field":"unitAmountDecimal"},"directive":"default"},"argument":"","value":"\"\""},{"tag":"UpdateField","model":"PremiumPrice","field":"unitAmount","arity":"Optional"},{"tag":"DeleteDirective","location":{"path":{"tag":"Field","model":"PremiumPrice","field":"unitAmount"},"directive":"default"}},{"tag":"UpdateField","model":"PremiumPrice","field":"unitAmountDecimal","arity":"Optional"},{"tag":"DeleteDirective","location":{"path":{"tag":"Field","model":"PremiumPrice","field":"unitAmountDecimal"},"directive":"default"}},{"tag":"DeleteField","model":"PremiumPrice","field":"unitAmountDecimal"},{"tag":"CreateModel","model":"PremiumSubscription"},{"tag":"CreateField","model":"PremiumSubscription","field":"id","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"PremiumSubscription","field":"id"},"directive":"id"}},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"PremiumSubscription","field":"id"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"PremiumSubscription","field":"id"},"directive":"default"},"argument":"","value":"uuid()"},{"tag":"CreateField","model":"PremiumSubscription","field":"uid","type":"String","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"PremiumSubscription","field":"uid"},"directive":"unique"}},{"tag":"CreateField","model":"PremiumSubscription","field":"currentPeriodEnd","type":"DateTime","arity":"Optional"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"PremiumSubscription","field":"currentPeriodEnd"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"PremiumSubscription","field":"currentPeriodEnd"},"directive":"map"},"argument":"","value":"\"current_period_end\""},{"tag":"CreateField","model":"PremiumSubscription","field":"createdAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"PremiumSubscription","field":"createdAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"PremiumSubscription","field":"createdAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"PremiumSubscription","field":"createdAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"PremiumSubscription","field":"createdAt"},"directive":"map"},"argument":"","value":"\"created_at\""},{"tag":"CreateField","model":"PremiumSubscription","field":"updatedAt","type":"DateTime","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"PremiumSubscription","field":"updatedAt"},"directive":"default"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"PremiumSubscription","field":"updatedAt"},"directive":"default"},"argument":"","value":"now()"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"PremiumSubscription","field":"updatedAt"},"directive":"updatedAt"}},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"PremiumSubscription","field":"updatedAt"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"PremiumSubscription","field":"updatedAt"},"directive":"map"},"argument":"","value":"\"updated_at\""},{"tag":"CreateField","model":"PremiumSubscription","field":"User","type":"User","arity":"Required"},{"tag":"CreateDirective","location":{"path":{"tag":"Field","model":"PremiumSubscription","field":"User"},"directive":"relation"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"PremiumSubscription","field":"User"},"directive":"relation"},"argument":"fields","value":"[uid]"},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Field","model":"PremiumSubscription","field":"User"},"directive":"relation"},"argument":"references","value":"[id]"},{"tag":"CreateDirective","location":{"path":{"tag":"Model","model":"PremiumSubscription"},"directive":"map"}},{"tag":"CreateArgument","location":{"tag":"Directive","path":{"tag":"Model","model":"PremiumSubscription"},"directive":"map"},"argument":"name","value":"\"premium_subscriptions\""},{"tag":"DeleteModel","model":"StripeProduct"},{"tag":"DeleteModel","model":"StripePrice"},{"tag":"DeleteModel","model":"UserSubscription"},{"tag":"UpdateField","model":"User","field":"Subscription","type":"PremiumSubscription"}],"stepsToApply":[{}],"sourceConfig":"generator client {\n  provider = \"prisma-client-js\"\n}\n\ndatasource postgresql {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nmodel User {\n  id               String   @id @default(uuid())\n  email            String?  @unique\n  emailVerified    Boolean  @default(false) @map(\"email_verified\")\n  password         String?\n  tokenVersion     Int      @default(1) @map(\"token_version\")\n  disabled         Boolean  @default(false)\n  isAdmin          Boolean  @default(false) @map(\"is_admin\")\n  googleId         String?  @unique @map(\"google_id\")\n  stripeCustomerId String?  @map(\"stripe_customer_id\")\n  createdAt        DateTime @default(now()) @map(\"created_at\")\n  updatedAt        DateTime @default(now()) @updatedAt @map(\"updated_at\")\n\n  Transactions        Transaction[]\n  Categories          Category[]\n  Budgets             Budget[]\n  Feedback            Feedback[]\n  Profile             Profile?\n  Log                 Log[]\n  TransactionSchedule TransactionSchedule[]\n  Subscription        PremiumSubscription?\n\n  @@map(name: \"users\")\n}\n\nmodel Profile {\n  uid            String   @id\n  displayName    String?  @map(\"display_name\")\n  photoUrl       String?  @map(\"photo_url\")\n  googlePhotoUrl String?  @map(\"google_photo_url\")\n  themeColor     String?  @map(\"theme_color\")\n  themeMode      String?  @map(\"theme_mode\")\n  createdAt      DateTime @default(now()) @map(\"created_at\")\n  updatedAt      DateTime @default(now()) @updatedAt @map(\"updated_at\")\n\n  User User @relation(fields: [uid], references: [id])\n\n  @@map(name: \"profiles\")\n}\n\nmodel Transaction {\n  id            String   @id @default(uuid())\n  uid           String\n  categoryId    String   @map(\"category_id\")\n  comment       String?\n  integerAmount Int      @map(\"integer_amount\")\n  time          DateTime\n  createdAt     DateTime @default(now()) @map(\"created_at\")\n  updatedAt     DateTime @default(now()) @updatedAt @map(\"updated_at\")\n  scheduleId    String?  @map(\"schedule_id\")\n\n  User     User                 @relation(fields: [uid], references: [id])\n  Category Category             @relation(fields: [categoryId], references: [id])\n  Schedule TransactionSchedule? @relation(fields: [scheduleId], references: [id])\n\n  @@map(name: \"transactions\")\n}\n\nmodel TransactionSchedule {\n  id                      String       @id @default(uuid())\n  uid                     String\n  categoryId              String       @map(\"category_id\")\n  comment                 String?\n  integerAmount           Int          @map(\"integer_amount\")\n  intervalType            IntervalType @map(\"interval_type\")\n  intervalEvery           Int          @default(1) @map(\"interval_every\")\n  firstOccurrence         DateTime     @map(\"first_occurrence\")\n  occurrences             Int?\n  createdAt               DateTime     @default(now()) @map(\"created_at\")\n  updatedAt               DateTime     @default(now()) @updatedAt @map(\"updated_at\")\n  latestCreatedOccurrence DateTime?    @map(\"latest_created_occurrence\")\n\n  User         User          @relation(fields: [uid], references: [id])\n  Category     Category      @relation(fields: [categoryId], references: [id])\n  Transactions Transaction[]\n\n  @@map(name: \"transaction_schedules\")\n}\n\nenum IntervalType {\n  DAY\n  WEEK\n  MONTH\n  YEAR\n}\n\nmodel Budget {\n  id            String   @id @default(uuid())\n  uid           String\n  label         String?\n  integerAmount Int      @map(\"integer_amount\")\n  createdAt     DateTime @default(now()) @map(\"created_at\")\n  updatedAt     DateTime @default(now()) @updatedAt @map(\"updated_at\")\n  periodMonths  Int      @default(1) @map(\"period_months\")\n\n  BudgetCategoryInclusions BudgetCategoryInclusion[]\n\n  User User @relation(fields: [uid], references: [id])\n\n  @@map(name: \"budgets\")\n}\n\nmodel BudgetCategoryInclusion {\n  budgetId   String @map(\"budget_id\")\n  categoryId String @map(\"category_id\")\n\n  Budget   Budget   @relation(fields: [budgetId], references: [id])\n  Category Category @relation(fields: [categoryId], references: [id])\n\n  @@id([categoryId, budgetId])\n}\n\nmodel Category {\n  id        String   @id @default(uuid())\n  uid       String\n  value     String\n  icon      String?\n  createdAt DateTime @default(now()) @map(\"created_at\")\n  updatedAt DateTime @default(now()) @updatedAt @map(\"updated_at\")\n\n  Transactions             Transaction[]\n  BudgetCategoryInclusions BudgetCategoryInclusion[]\n  TransactionSchedule      TransactionSchedule[]\n\n  User User @relation(fields: [uid], references: [id])\n\n  @@unique([uid, value], name: \"unique_uid_value\")\n  @@unique([uid, id], name: \"unique_uid_id\")\n  @@map(name: \"categories\")\n}\n\nmodel Feedback {\n  id      String  @id @default(uuid())\n  uid     String\n  message String?\n\n  User User @relation(fields: [uid], references: [id])\n}\n\nmodel Log {\n  id         String   @id @default(uuid())\n  uid        String?\n  type       String\n  message    String\n  data       String\n  stackTrace String   @map(\"stack_trace\")\n  device     String\n  timestamp  Int\n  timestring String\n  createdAt  DateTime @default(now()) @map(\"created_at\")\n  href       String\n\n  User User? @relation(fields: [uid], references: [id])\n}\n\nmodel Config {\n  key   String @id\n  value String\n}\n\n// Subscriptions\nmodel PremiumSubscription {\n  id               String    @id @default(uuid())\n  uid              String    @unique\n  currentPeriodEnd DateTime? @map(\"current_period_end\")\n  createdAt        DateTime  @default(now()) @map(\"created_at\")\n  updatedAt        DateTime  @default(now()) @updatedAt @map(\"updated_at\")\n\n  User User @relation(fields: [uid], references: [id])\n\n  @@map(name: \"premium_subscriptions\")\n}\n\nmodel PremiumPrice {\n  id                     String   @id\n  unitAmount             Int?     @map(\"unit_amount\")\n  productId              String   @map(\"product_id\")\n  active                 Boolean\n  currency               String\n  nickname               String?\n  type                   String\n  recurringInterval      String?  @map(\"recurring_interval\")\n  recurringIntervalCount Int?     @map(\"recurring_interval_count\")\n  createdAt              DateTime @default(now()) @map(\"created_at\")\n  updatedAt              DateTime @default(now()) @updatedAt @map(\"updated_at\")\n\n  @@map(name: \"premium_prices\")\n}\n\n// @DEPRECATED\nenum SubscribableProduct {\n  PREMIUM\n}\n"}}
```

## RPC Input Readable
```json
{
  "id": 3,
  "jsonrpc": "2.0",
  "method": "calculateDatabaseSteps",
  "params": {
    "projectInfo": "",
    "assumeToBeApplied": [
      {
        "tag": "CreateSource",
        "source": "postgresql"
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Source",
          "source": "postgresql"
        },
        "argument": "provider",
        "value": "\"postgresql\""
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Source",
          "source": "postgresql"
        },
        "argument": "url",
        "value": "\"***\""
      },
      {
        "tag": "CreateModel",
        "model": "Transaction"
      },
      {
        "tag": "CreateField",
        "model": "Transaction",
        "field": "id",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "id"
          },
          "directive": "id"
        }
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "id"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "id"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "uuid()"
      },
      {
        "tag": "CreateField",
        "model": "Transaction",
        "field": "uid",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "Transaction",
        "field": "categoryId",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "categoryId"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "categoryId"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"category_id\""
      },
      {
        "tag": "CreateField",
        "model": "Transaction",
        "field": "comment",
        "type": "String",
        "arity": "Optional"
      },
      {
        "tag": "CreateField",
        "model": "Transaction",
        "field": "integerAmount",
        "type": "Int",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "integerAmount"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "integerAmount"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"integer_amount\""
      },
      {
        "tag": "CreateField",
        "model": "Transaction",
        "field": "time",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "Transaction",
        "field": "createdAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "createdAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "createdAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "createdAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "createdAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"created_at\""
      },
      {
        "tag": "CreateField",
        "model": "Transaction",
        "field": "updatedAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "updatedAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "updatedAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "updatedAt"
          },
          "directive": "updatedAt"
        }
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "updatedAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "updatedAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"updated_at\""
      },
      {
        "tag": "CreateField",
        "model": "Transaction",
        "field": "User",
        "type": "User",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "User"
          },
          "directive": "relation"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "User"
          },
          "directive": "relation"
        },
        "argument": "fields",
        "value": "[uid]"
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "User"
          },
          "directive": "relation"
        },
        "argument": "references",
        "value": "[id]"
      },
      {
        "tag": "CreateField",
        "model": "Transaction",
        "field": "Category",
        "type": "Category",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "Category"
          },
          "directive": "relation"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "Category"
          },
          "directive": "relation"
        },
        "argument": "fields",
        "value": "[categoryId]"
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "Category"
          },
          "directive": "relation"
        },
        "argument": "references",
        "value": "[id]"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Model",
            "model": "Transaction"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Model",
            "model": "Transaction"
          },
          "directive": "map"
        },
        "argument": "name",
        "value": "\"transactions\""
      },
      {
        "tag": "CreateModel",
        "model": "User"
      },
      {
        "tag": "CreateField",
        "model": "User",
        "field": "id",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "id"
          },
          "directive": "id"
        }
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "id"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "id"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "uuid()"
      },
      {
        "tag": "CreateField",
        "model": "User",
        "field": "displayName",
        "type": "String",
        "arity": "Optional"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "displayName"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "displayName"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"display_name\""
      },
      {
        "tag": "CreateField",
        "model": "User",
        "field": "email",
        "type": "String",
        "arity": "Optional"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "email"
          },
          "directive": "unique"
        }
      },
      {
        "tag": "CreateField",
        "model": "User",
        "field": "emailVerified",
        "type": "Boolean",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "emailVerified"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "emailVerified"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "false"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "emailVerified"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "emailVerified"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"email_verified\""
      },
      {
        "tag": "CreateField",
        "model": "User",
        "field": "password",
        "type": "String",
        "arity": "Optional"
      },
      {
        "tag": "CreateField",
        "model": "User",
        "field": "googleId",
        "type": "String",
        "arity": "Optional"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "googleId"
          },
          "directive": "unique"
        }
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "googleId"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "googleId"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"google_id\""
      },
      {
        "tag": "CreateField",
        "model": "User",
        "field": "photoUrl",
        "type": "String",
        "arity": "Optional"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "photoUrl"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "photoUrl"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"photo_url\""
      },
      {
        "tag": "CreateField",
        "model": "User",
        "field": "tokenVersion",
        "type": "Int",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "tokenVersion"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "tokenVersion"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "1"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "tokenVersion"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "tokenVersion"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"token_version\""
      },
      {
        "tag": "CreateField",
        "model": "User",
        "field": "disabled",
        "type": "Boolean",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "disabled"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "disabled"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "false"
      },
      {
        "tag": "CreateField",
        "model": "User",
        "field": "isAdmin",
        "type": "Boolean",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "isAdmin"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "isAdmin"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "false"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "isAdmin"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "isAdmin"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"is_admin\""
      },
      {
        "tag": "CreateField",
        "model": "User",
        "field": "themeColor",
        "type": "String",
        "arity": "Optional"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "themeColor"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "themeColor"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"theme_color\""
      },
      {
        "tag": "CreateField",
        "model": "User",
        "field": "themeMode",
        "type": "String",
        "arity": "Optional"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "themeMode"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "themeMode"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"theme_mode\""
      },
      {
        "tag": "CreateField",
        "model": "User",
        "field": "createdAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "createdAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "createdAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "createdAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "createdAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"created_at\""
      },
      {
        "tag": "CreateField",
        "model": "User",
        "field": "updatedAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "updatedAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "updatedAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "updatedAt"
          },
          "directive": "updatedAt"
        }
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "updatedAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "updatedAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"updated_at\""
      },
      {
        "tag": "CreateField",
        "model": "User",
        "field": "stripeCustomerId",
        "type": "String",
        "arity": "Optional"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "stripeCustomerId"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "User",
            "field": "stripeCustomerId"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"stripe_customer_id\""
      },
      {
        "tag": "CreateField",
        "model": "User",
        "field": "Transactions",
        "type": "Transaction",
        "arity": "List"
      },
      {
        "tag": "CreateField",
        "model": "User",
        "field": "Categories",
        "type": "Category",
        "arity": "List"
      },
      {
        "tag": "CreateField",
        "model": "User",
        "field": "Budgets",
        "type": "Budget",
        "arity": "List"
      },
      {
        "tag": "CreateField",
        "model": "User",
        "field": "Feedback",
        "type": "Feedback",
        "arity": "List"
      },
      {
        "tag": "CreateField",
        "model": "User",
        "field": "Profile",
        "type": "Profile",
        "arity": "Optional"
      },
      {
        "tag": "CreateField",
        "model": "User",
        "field": "Log",
        "type": "Log",
        "arity": "List"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Model",
            "model": "User"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Model",
            "model": "User"
          },
          "directive": "map"
        },
        "argument": "name",
        "value": "\"users\""
      },
      {
        "tag": "CreateModel",
        "model": "Profile"
      },
      {
        "tag": "CreateField",
        "model": "Profile",
        "field": "id",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Profile",
            "field": "id"
          },
          "directive": "id"
        }
      },
      {
        "tag": "CreateField",
        "model": "Profile",
        "field": "uid",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "Profile",
        "field": "displayName",
        "type": "String",
        "arity": "Optional"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Profile",
            "field": "displayName"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Profile",
            "field": "displayName"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"display_name\""
      },
      {
        "tag": "CreateField",
        "model": "Profile",
        "field": "photoUrl",
        "type": "String",
        "arity": "Optional"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Profile",
            "field": "photoUrl"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Profile",
            "field": "photoUrl"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"photo_url\""
      },
      {
        "tag": "CreateField",
        "model": "Profile",
        "field": "themeColor",
        "type": "String",
        "arity": "Optional"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Profile",
            "field": "themeColor"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Profile",
            "field": "themeColor"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"theme_color\""
      },
      {
        "tag": "CreateField",
        "model": "Profile",
        "field": "themeMode",
        "type": "String",
        "arity": "Optional"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Profile",
            "field": "themeMode"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Profile",
            "field": "themeMode"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"theme_mode\""
      },
      {
        "tag": "CreateField",
        "model": "Profile",
        "field": "User",
        "type": "User",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Profile",
            "field": "User"
          },
          "directive": "relation"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Profile",
            "field": "User"
          },
          "directive": "relation"
        },
        "argument": "fields",
        "value": "[uid]"
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Profile",
            "field": "User"
          },
          "directive": "relation"
        },
        "argument": "references",
        "value": "[id]"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Model",
            "model": "Profile"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Model",
            "model": "Profile"
          },
          "directive": "map"
        },
        "argument": "name",
        "value": "\"profiles\""
      },
      {
        "tag": "CreateModel",
        "model": "Budget"
      },
      {
        "tag": "CreateField",
        "model": "Budget",
        "field": "id",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Budget",
            "field": "id"
          },
          "directive": "id"
        }
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Budget",
            "field": "id"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Budget",
            "field": "id"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "uuid()"
      },
      {
        "tag": "CreateField",
        "model": "Budget",
        "field": "uid",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "Budget",
        "field": "label",
        "type": "String",
        "arity": "Optional"
      },
      {
        "tag": "CreateField",
        "model": "Budget",
        "field": "integerAmount",
        "type": "Int",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Budget",
            "field": "integerAmount"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Budget",
            "field": "integerAmount"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"integer_amount\""
      },
      {
        "tag": "CreateField",
        "model": "Budget",
        "field": "createdAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Budget",
            "field": "createdAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Budget",
            "field": "createdAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Budget",
            "field": "createdAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Budget",
            "field": "createdAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"created_at\""
      },
      {
        "tag": "CreateField",
        "model": "Budget",
        "field": "updatedAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Budget",
            "field": "updatedAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Budget",
            "field": "updatedAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Budget",
            "field": "updatedAt"
          },
          "directive": "updatedAt"
        }
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Budget",
            "field": "updatedAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Budget",
            "field": "updatedAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"updated_at\""
      },
      {
        "tag": "CreateField",
        "model": "Budget",
        "field": "periodMonths",
        "type": "Int",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Budget",
            "field": "periodMonths"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Budget",
            "field": "periodMonths"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "1"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Budget",
            "field": "periodMonths"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Budget",
            "field": "periodMonths"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"period_months\""
      },
      {
        "tag": "CreateField",
        "model": "Budget",
        "field": "BudgetCategoryInclusions",
        "type": "BudgetCategoryInclusion",
        "arity": "List"
      },
      {
        "tag": "CreateField",
        "model": "Budget",
        "field": "User",
        "type": "User",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Budget",
            "field": "User"
          },
          "directive": "relation"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Budget",
            "field": "User"
          },
          "directive": "relation"
        },
        "argument": "fields",
        "value": "[uid]"
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Budget",
            "field": "User"
          },
          "directive": "relation"
        },
        "argument": "references",
        "value": "[id]"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Model",
            "model": "Budget"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Model",
            "model": "Budget"
          },
          "directive": "map"
        },
        "argument": "name",
        "value": "\"budgets\""
      },
      {
        "tag": "CreateModel",
        "model": "BudgetCategoryInclusion"
      },
      {
        "tag": "CreateField",
        "model": "BudgetCategoryInclusion",
        "field": "budgetId",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "BudgetCategoryInclusion",
            "field": "budgetId"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "BudgetCategoryInclusion",
            "field": "budgetId"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"budget_id\""
      },
      {
        "tag": "CreateField",
        "model": "BudgetCategoryInclusion",
        "field": "categoryId",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "BudgetCategoryInclusion",
            "field": "categoryId"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "BudgetCategoryInclusion",
            "field": "categoryId"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"category_id\""
      },
      {
        "tag": "CreateField",
        "model": "BudgetCategoryInclusion",
        "field": "Budget",
        "type": "Budget",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "BudgetCategoryInclusion",
            "field": "Budget"
          },
          "directive": "relation"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "BudgetCategoryInclusion",
            "field": "Budget"
          },
          "directive": "relation"
        },
        "argument": "fields",
        "value": "[budgetId]"
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "BudgetCategoryInclusion",
            "field": "Budget"
          },
          "directive": "relation"
        },
        "argument": "references",
        "value": "[id]"
      },
      {
        "tag": "CreateField",
        "model": "BudgetCategoryInclusion",
        "field": "Category",
        "type": "Category",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "BudgetCategoryInclusion",
            "field": "Category"
          },
          "directive": "relation"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "BudgetCategoryInclusion",
            "field": "Category"
          },
          "directive": "relation"
        },
        "argument": "fields",
        "value": "[categoryId]"
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "BudgetCategoryInclusion",
            "field": "Category"
          },
          "directive": "relation"
        },
        "argument": "references",
        "value": "[id]"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Model",
            "model": "BudgetCategoryInclusion"
          },
          "directive": "id"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Model",
            "model": "BudgetCategoryInclusion"
          },
          "directive": "id"
        },
        "argument": "",
        "value": "[categoryId, budgetId]"
      },
      {
        "tag": "CreateModel",
        "model": "Category"
      },
      {
        "tag": "CreateField",
        "model": "Category",
        "field": "id",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Category",
            "field": "id"
          },
          "directive": "id"
        }
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Category",
            "field": "id"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Category",
            "field": "id"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "uuid()"
      },
      {
        "tag": "CreateField",
        "model": "Category",
        "field": "uid",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "Category",
        "field": "value",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "Category",
        "field": "icon",
        "type": "String",
        "arity": "Optional"
      },
      {
        "tag": "CreateField",
        "model": "Category",
        "field": "createdAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Category",
            "field": "createdAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Category",
            "field": "createdAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Category",
            "field": "createdAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Category",
            "field": "createdAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"created_at\""
      },
      {
        "tag": "CreateField",
        "model": "Category",
        "field": "updatedAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Category",
            "field": "updatedAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Category",
            "field": "updatedAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Category",
            "field": "updatedAt"
          },
          "directive": "updatedAt"
        }
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Category",
            "field": "updatedAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Category",
            "field": "updatedAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"updated_at\""
      },
      {
        "tag": "CreateField",
        "model": "Category",
        "field": "Transactions",
        "type": "Transaction",
        "arity": "List"
      },
      {
        "tag": "CreateField",
        "model": "Category",
        "field": "BudgetCategoryInclusions",
        "type": "BudgetCategoryInclusion",
        "arity": "List"
      },
      {
        "tag": "CreateField",
        "model": "Category",
        "field": "User",
        "type": "User",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Category",
            "field": "User"
          },
          "directive": "relation"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Category",
            "field": "User"
          },
          "directive": "relation"
        },
        "argument": "fields",
        "value": "[uid]"
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Category",
            "field": "User"
          },
          "directive": "relation"
        },
        "argument": "references",
        "value": "[id]"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Model",
            "model": "Category"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Model",
            "model": "Category"
          },
          "directive": "map"
        },
        "argument": "name",
        "value": "\"categories\""
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Model",
            "model": "Category",
            "arguments": [
              {
                "name": "",
                "value": "[uid, value]"
              },
              {
                "name": "name",
                "value": "\"unique_uid_value\""
              }
            ]
          },
          "directive": "unique"
        }
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Model",
            "model": "Category",
            "arguments": [
              {
                "name": "",
                "value": "[uid, id]"
              },
              {
                "name": "name",
                "value": "\"unique_uid_id\""
              }
            ]
          },
          "directive": "unique"
        }
      },
      {
        "tag": "CreateModel",
        "model": "Feedback"
      },
      {
        "tag": "CreateField",
        "model": "Feedback",
        "field": "id",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Feedback",
            "field": "id"
          },
          "directive": "id"
        }
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Feedback",
            "field": "id"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Feedback",
            "field": "id"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "uuid()"
      },
      {
        "tag": "CreateField",
        "model": "Feedback",
        "field": "uid",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "Feedback",
        "field": "message",
        "type": "String",
        "arity": "Optional"
      },
      {
        "tag": "CreateField",
        "model": "Feedback",
        "field": "User",
        "type": "User",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Feedback",
            "field": "User"
          },
          "directive": "relation"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Feedback",
            "field": "User"
          },
          "directive": "relation"
        },
        "argument": "fields",
        "value": "[uid]"
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Feedback",
            "field": "User"
          },
          "directive": "relation"
        },
        "argument": "references",
        "value": "[id]"
      },
      {
        "tag": "CreateModel",
        "model": "Log"
      },
      {
        "tag": "CreateField",
        "model": "Log",
        "field": "id",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Log",
            "field": "id"
          },
          "directive": "id"
        }
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Log",
            "field": "id"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Log",
            "field": "id"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "uuid()"
      },
      {
        "tag": "CreateField",
        "model": "Log",
        "field": "uid",
        "type": "String",
        "arity": "Optional"
      },
      {
        "tag": "CreateField",
        "model": "Log",
        "field": "type",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "Log",
        "field": "message",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "Log",
        "field": "data",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "Log",
        "field": "stackTrace",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Log",
            "field": "stackTrace"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Log",
            "field": "stackTrace"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"stack_trace\""
      },
      {
        "tag": "CreateField",
        "model": "Log",
        "field": "device",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "Log",
        "field": "timestamp",
        "type": "Int",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "Log",
        "field": "timestring",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "Log",
        "field": "createdAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Log",
            "field": "createdAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Log",
            "field": "createdAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Log",
            "field": "createdAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Log",
            "field": "createdAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"created_at\""
      },
      {
        "tag": "CreateField",
        "model": "Log",
        "field": "href",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "Log",
        "field": "User",
        "type": "User",
        "arity": "Optional"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Log",
            "field": "User"
          },
          "directive": "relation"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Log",
            "field": "User"
          },
          "directive": "relation"
        },
        "argument": "fields",
        "value": "[uid]"
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Log",
            "field": "User"
          },
          "directive": "relation"
        },
        "argument": "references",
        "value": "[id]"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Profile",
            "field": "id"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Profile",
            "field": "id"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "uuid()"
      },
      {
        "tag": "DeleteField",
        "model": "Profile",
        "field": "id"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Profile",
            "field": "uid"
          },
          "directive": "id"
        }
      },
      {
        "tag": "DeleteField",
        "model": "User",
        "field": "displayName"
      },
      {
        "tag": "DeleteField",
        "model": "User",
        "field": "photoUrl"
      },
      {
        "tag": "DeleteField",
        "model": "User",
        "field": "themeColor"
      },
      {
        "tag": "DeleteField",
        "model": "User",
        "field": "themeMode"
      },
      {
        "tag": "CreateModel",
        "model": "Config"
      },
      {
        "tag": "CreateField",
        "model": "Config",
        "field": "key",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Config",
            "field": "key"
          },
          "directive": "id"
        }
      },
      {
        "tag": "CreateField",
        "model": "Config",
        "field": "value",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "Profile",
        "field": "googlePhotoUrl",
        "type": "String",
        "arity": "Optional"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Profile",
            "field": "googlePhotoUrl"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Profile",
            "field": "googlePhotoUrl"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"google_photo_url\""
      },
      {
        "tag": "CreateModel",
        "model": "TransactionRecurrence"
      },
      {
        "tag": "CreateField",
        "model": "TransactionRecurrence",
        "field": "id",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "id"
          },
          "directive": "id"
        }
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "id"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "id"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "uuid()"
      },
      {
        "tag": "CreateField",
        "model": "TransactionRecurrence",
        "field": "uid",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "TransactionRecurrence",
        "field": "categoryId",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "categoryId"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "categoryId"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"category_id\""
      },
      {
        "tag": "CreateField",
        "model": "TransactionRecurrence",
        "field": "comment",
        "type": "String",
        "arity": "Optional"
      },
      {
        "tag": "CreateField",
        "model": "TransactionRecurrence",
        "field": "integerAmount",
        "type": "Int",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "integerAmount"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "integerAmount"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"integer_amount\""
      },
      {
        "tag": "CreateField",
        "model": "TransactionRecurrence",
        "field": "createdAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "createdAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "createdAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "createdAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "createdAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"created_at\""
      },
      {
        "tag": "CreateField",
        "model": "TransactionRecurrence",
        "field": "updatedAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "updatedAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "updatedAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "updatedAt"
          },
          "directive": "updatedAt"
        }
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "updatedAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "updatedAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"updated_at\""
      },
      {
        "tag": "CreateField",
        "model": "TransactionRecurrence",
        "field": "User",
        "type": "User",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "User"
          },
          "directive": "relation"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "User"
          },
          "directive": "relation"
        },
        "argument": "fields",
        "value": "[uid]"
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "User"
          },
          "directive": "relation"
        },
        "argument": "references",
        "value": "[id]"
      },
      {
        "tag": "CreateField",
        "model": "TransactionRecurrence",
        "field": "Category",
        "type": "Category",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "Category"
          },
          "directive": "relation"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "Category"
          },
          "directive": "relation"
        },
        "argument": "fields",
        "value": "[categoryId]"
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "Category"
          },
          "directive": "relation"
        },
        "argument": "references",
        "value": "[id]"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Model",
            "model": "TransactionRecurrence"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Model",
            "model": "TransactionRecurrence"
          },
          "directive": "map"
        },
        "argument": "name",
        "value": "\"transaction_recurrences\""
      },
      {
        "tag": "CreateField",
        "model": "User",
        "field": "TransactionRecurrence",
        "type": "TransactionRecurrence",
        "arity": "List"
      },
      {
        "tag": "CreateField",
        "model": "Category",
        "field": "TransactionRecurrence",
        "type": "TransactionRecurrence",
        "arity": "List"
      },
      {
        "tag": "CreateEnum",
        "enum": "IntervalType",
        "values": [
          "DAY",
          "WEEK",
          "MONTH",
          "YEAR"
        ]
      },
      {
        "tag": "CreateField",
        "model": "Transaction",
        "field": "recurrenceId",
        "type": "String",
        "arity": "Optional"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "recurrenceId"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "recurrenceId"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"recurrence_id\""
      },
      {
        "tag": "CreateField",
        "model": "Transaction",
        "field": "Recurrence",
        "type": "TransactionRecurrence",
        "arity": "Optional"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "Recurrence"
          },
          "directive": "relation"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "Recurrence"
          },
          "directive": "relation"
        },
        "argument": "fields",
        "value": "[recurrenceId]"
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "Recurrence"
          },
          "directive": "relation"
        },
        "argument": "references",
        "value": "[id]"
      },
      {
        "tag": "CreateField",
        "model": "User",
        "field": "TransactionRecurrences",
        "type": "TransactionRecurrence",
        "arity": "List"
      },
      {
        "tag": "DeleteField",
        "model": "User",
        "field": "TransactionRecurrence"
      },
      {
        "tag": "CreateField",
        "model": "TransactionRecurrence",
        "field": "intervalType",
        "type": "IntervalType",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "intervalType"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "intervalType"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"interval_type\""
      },
      {
        "tag": "CreateField",
        "model": "TransactionRecurrence",
        "field": "intervalLength",
        "type": "Int",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "intervalLength"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "intervalLength"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"interval_length\""
      },
      {
        "tag": "CreateField",
        "model": "TransactionRecurrence",
        "field": "firstOccurence",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "firstOccurence"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "firstOccurence"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"first_occurence\""
      },
      {
        "tag": "CreateField",
        "model": "TransactionRecurrence",
        "field": "lastOccurence",
        "type": "DateTime",
        "arity": "Optional"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "lastOccurence"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionRecurrence",
            "field": "lastOccurence"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"last_occurence\""
      },
      {
        "tag": "CreateField",
        "model": "TransactionRecurrence",
        "field": "Transaction",
        "type": "Transaction",
        "arity": "List"
      },
      {
        "tag": "CreateModel",
        "model": "TransactionSchedule"
      },
      {
        "tag": "CreateField",
        "model": "TransactionSchedule",
        "field": "id",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "id"
          },
          "directive": "id"
        }
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "id"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "id"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "uuid()"
      },
      {
        "tag": "CreateField",
        "model": "TransactionSchedule",
        "field": "uid",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "TransactionSchedule",
        "field": "categoryId",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "categoryId"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "categoryId"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"category_id\""
      },
      {
        "tag": "CreateField",
        "model": "TransactionSchedule",
        "field": "comment",
        "type": "String",
        "arity": "Optional"
      },
      {
        "tag": "CreateField",
        "model": "TransactionSchedule",
        "field": "integerAmount",
        "type": "Int",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "integerAmount"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "integerAmount"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"integer_amount\""
      },
      {
        "tag": "CreateField",
        "model": "TransactionSchedule",
        "field": "intervalType",
        "type": "IntervalType",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "intervalType"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "intervalType"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"interval_type\""
      },
      {
        "tag": "CreateField",
        "model": "TransactionSchedule",
        "field": "intervalLength",
        "type": "Int",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "intervalLength"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "intervalLength"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"interval_length\""
      },
      {
        "tag": "CreateField",
        "model": "TransactionSchedule",
        "field": "firstOccurrence",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "firstOccurrence"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "firstOccurrence"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"first_occurrence\""
      },
      {
        "tag": "CreateField",
        "model": "TransactionSchedule",
        "field": "lastOccurrence",
        "type": "DateTime",
        "arity": "Optional"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "lastOccurrence"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "lastOccurrence"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"last_occurrence\""
      },
      {
        "tag": "CreateField",
        "model": "TransactionSchedule",
        "field": "createdAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "createdAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "createdAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "createdAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "createdAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"created_at\""
      },
      {
        "tag": "CreateField",
        "model": "TransactionSchedule",
        "field": "updatedAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "updatedAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "updatedAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "updatedAt"
          },
          "directive": "updatedAt"
        }
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "updatedAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "updatedAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"updated_at\""
      },
      {
        "tag": "CreateField",
        "model": "TransactionSchedule",
        "field": "User",
        "type": "User",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "User"
          },
          "directive": "relation"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "User"
          },
          "directive": "relation"
        },
        "argument": "fields",
        "value": "[uid]"
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "User"
          },
          "directive": "relation"
        },
        "argument": "references",
        "value": "[id]"
      },
      {
        "tag": "CreateField",
        "model": "TransactionSchedule",
        "field": "Category",
        "type": "Category",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "Category"
          },
          "directive": "relation"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "Category"
          },
          "directive": "relation"
        },
        "argument": "fields",
        "value": "[categoryId]"
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "Category"
          },
          "directive": "relation"
        },
        "argument": "references",
        "value": "[id]"
      },
      {
        "tag": "CreateField",
        "model": "TransactionSchedule",
        "field": "Transaction",
        "type": "Transaction",
        "arity": "List"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Model",
            "model": "TransactionSchedule"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Model",
            "model": "TransactionSchedule"
          },
          "directive": "map"
        },
        "argument": "name",
        "value": "\"transaction_schedules\""
      },
      {
        "tag": "DeleteModel",
        "model": "TransactionRecurrence"
      },
      {
        "tag": "CreateField",
        "model": "Transaction",
        "field": "scheduleId",
        "type": "String",
        "arity": "Optional"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "scheduleId"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "scheduleId"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"schedule_id\""
      },
      {
        "tag": "CreateField",
        "model": "Transaction",
        "field": "Schedule",
        "type": "TransactionSchedule",
        "arity": "Optional"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "Schedule"
          },
          "directive": "relation"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "Schedule"
          },
          "directive": "relation"
        },
        "argument": "fields",
        "value": "[scheduleId]"
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Transaction",
            "field": "Schedule"
          },
          "directive": "relation"
        },
        "argument": "references",
        "value": "[id]"
      },
      {
        "tag": "DeleteField",
        "model": "Transaction",
        "field": "recurrenceId"
      },
      {
        "tag": "DeleteField",
        "model": "Transaction",
        "field": "Recurrence"
      },
      {
        "tag": "CreateField",
        "model": "User",
        "field": "TransactionSchedule",
        "type": "TransactionSchedule",
        "arity": "List"
      },
      {
        "tag": "DeleteField",
        "model": "User",
        "field": "TransactionRecurrences"
      },
      {
        "tag": "CreateField",
        "model": "Category",
        "field": "TransactionSchedule",
        "type": "TransactionSchedule",
        "arity": "List"
      },
      {
        "tag": "DeleteField",
        "model": "Category",
        "field": "TransactionRecurrence"
      },
      {
        "tag": "CreateField",
        "model": "Profile",
        "field": "createdAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Profile",
            "field": "createdAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Profile",
            "field": "createdAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Profile",
            "field": "createdAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Profile",
            "field": "createdAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"created_at\""
      },
      {
        "tag": "CreateField",
        "model": "Profile",
        "field": "updatedAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Profile",
            "field": "updatedAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Profile",
            "field": "updatedAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Profile",
            "field": "updatedAt"
          },
          "directive": "updatedAt"
        }
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Profile",
            "field": "updatedAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Profile",
            "field": "updatedAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"updated_at\""
      },
      {
        "tag": "CreateField",
        "model": "TransactionSchedule",
        "field": "occurrences",
        "type": "Int",
        "arity": "Required"
      },
      {
        "tag": "DeleteField",
        "model": "TransactionSchedule",
        "field": "lastOccurrence"
      },
      {
        "tag": "CreateField",
        "model": "TransactionSchedule",
        "field": "Transactions",
        "type": "Transaction",
        "arity": "List"
      },
      {
        "tag": "DeleteField",
        "model": "TransactionSchedule",
        "field": "Transaction"
      },
      {
        "tag": "UpdateField",
        "model": "TransactionSchedule",
        "field": "occurrences",
        "arity": "Optional"
      },
      {
        "tag": "CreateField",
        "model": "TransactionSchedule",
        "field": "intervalEvery",
        "type": "Int",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "intervalEvery"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "intervalEvery"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "1"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "intervalEvery"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "intervalEvery"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"interval_every\""
      },
      {
        "tag": "DeleteField",
        "model": "TransactionSchedule",
        "field": "intervalLength"
      },
      {
        "tag": "CreateField",
        "model": "TransactionSchedule",
        "field": "latestCreatedOccurrence",
        "type": "DateTime",
        "arity": "Optional"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "latestCreatedOccurrence"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "TransactionSchedule",
            "field": "latestCreatedOccurrence"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"latest_created_occurrence\""
      },
      {
        "tag": "CreateEnum",
        "enum": "SubscribableProduct",
        "values": [
          "PREMIUM"
        ]
      },
      {
        "tag": "CreateModel",
        "model": "Subscription"
      },
      {
        "tag": "CreateField",
        "model": "Subscription",
        "field": "id",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Subscription",
            "field": "id"
          },
          "directive": "id"
        }
      },
      {
        "tag": "CreateField",
        "model": "Subscription",
        "field": "uid",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "Subscription",
        "field": "product",
        "type": "SubscribableProduct",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "Subscription",
        "field": "currentPeriodEnd",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Subscription",
            "field": "currentPeriodEnd"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Subscription",
            "field": "currentPeriodEnd"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"current_period_end\""
      },
      {
        "tag": "CreateField",
        "model": "Subscription",
        "field": "createdAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Subscription",
            "field": "createdAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Subscription",
            "field": "createdAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Subscription",
            "field": "createdAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Subscription",
            "field": "createdAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"created_at\""
      },
      {
        "tag": "CreateField",
        "model": "Subscription",
        "field": "updatedAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Subscription",
            "field": "updatedAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Subscription",
            "field": "updatedAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Subscription",
            "field": "updatedAt"
          },
          "directive": "updatedAt"
        }
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Subscription",
            "field": "updatedAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Subscription",
            "field": "updatedAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"updated_at\""
      },
      {
        "tag": "CreateField",
        "model": "Subscription",
        "field": "User",
        "type": "User",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Subscription",
            "field": "User"
          },
          "directive": "relation"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Subscription",
            "field": "User"
          },
          "directive": "relation"
        },
        "argument": "fields",
        "value": "[uid]"
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Subscription",
            "field": "User"
          },
          "directive": "relation"
        },
        "argument": "references",
        "value": "[id]"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Model",
            "model": "Subscription"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Model",
            "model": "Subscription"
          },
          "directive": "map"
        },
        "argument": "name",
        "value": "\"subscriptions\""
      },
      {
        "tag": "CreateField",
        "model": "User",
        "field": "Subscription",
        "type": "Subscription",
        "arity": "Optional"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Subscription",
            "field": "uid"
          },
          "directive": "unique"
        }
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Subscription",
            "field": "id"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Subscription",
            "field": "id"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "uuid()"
      },
      {
        "tag": "CreateModel",
        "model": "Product"
      },
      {
        "tag": "CreateField",
        "model": "Product",
        "field": "id",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Product",
            "field": "id"
          },
          "directive": "id"
        }
      },
      {
        "tag": "CreateField",
        "model": "Product",
        "field": "active",
        "type": "Boolean",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "Product",
        "field": "description",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "Product",
        "field": "name",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "Product",
        "field": "createdAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Product",
            "field": "createdAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Product",
            "field": "createdAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Product",
            "field": "createdAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Product",
            "field": "createdAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"created_at\""
      },
      {
        "tag": "CreateField",
        "model": "Product",
        "field": "updatedAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Product",
            "field": "updatedAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Product",
            "field": "updatedAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Product",
            "field": "updatedAt"
          },
          "directive": "updatedAt"
        }
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "Product",
            "field": "updatedAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "Product",
            "field": "updatedAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"updated_at\""
      },
      {
        "tag": "CreateField",
        "model": "Product",
        "field": "ProductPrice",
        "type": "ProductPrice",
        "arity": "List"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Model",
            "model": "Product"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Model",
            "model": "Product"
          },
          "directive": "map"
        },
        "argument": "name",
        "value": "\"products\""
      },
      {
        "tag": "CreateModel",
        "model": "ProductPrice"
      },
      {
        "tag": "CreateField",
        "model": "ProductPrice",
        "field": "id",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "ProductPrice",
            "field": "id"
          },
          "directive": "id"
        }
      },
      {
        "tag": "CreateField",
        "model": "ProductPrice",
        "field": "productId",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "ProductPrice",
            "field": "productId"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "ProductPrice",
            "field": "productId"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"product_id\""
      },
      {
        "tag": "CreateField",
        "model": "ProductPrice",
        "field": "active",
        "type": "Boolean",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "ProductPrice",
        "field": "currency",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "ProductPrice",
        "field": "nickname",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "ProductPrice",
        "field": "type",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "ProductPrice",
        "field": "recurringInterval",
        "type": "IntervalType",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "ProductPrice",
            "field": "recurringInterval"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "ProductPrice",
            "field": "recurringInterval"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"recurring_interval\""
      },
      {
        "tag": "CreateField",
        "model": "ProductPrice",
        "field": "createdAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "ProductPrice",
            "field": "createdAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "ProductPrice",
            "field": "createdAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "ProductPrice",
            "field": "createdAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "ProductPrice",
            "field": "createdAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"created_at\""
      },
      {
        "tag": "CreateField",
        "model": "ProductPrice",
        "field": "updatedAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "ProductPrice",
            "field": "updatedAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "ProductPrice",
            "field": "updatedAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "ProductPrice",
            "field": "updatedAt"
          },
          "directive": "updatedAt"
        }
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "ProductPrice",
            "field": "updatedAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "ProductPrice",
            "field": "updatedAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"updated_at\""
      },
      {
        "tag": "CreateField",
        "model": "ProductPrice",
        "field": "Product",
        "type": "Product",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "ProductPrice",
            "field": "Product"
          },
          "directive": "relation"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "ProductPrice",
            "field": "Product"
          },
          "directive": "relation"
        },
        "argument": "fields",
        "value": "[productId]"
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "ProductPrice",
            "field": "Product"
          },
          "directive": "relation"
        },
        "argument": "references",
        "value": "[id]"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Model",
            "model": "ProductPrice"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Model",
            "model": "ProductPrice"
          },
          "directive": "map"
        },
        "argument": "name",
        "value": "\"product_prices\""
      },
      {
        "tag": "UpdateField",
        "model": "Subscription",
        "field": "currentPeriodEnd",
        "arity": "Optional"
      },
      {
        "tag": "UpdateField",
        "model": "ProductPrice",
        "field": "recurringInterval",
        "type": "String"
      },
      {
        "tag": "CreateModel",
        "model": "StripeProduct"
      },
      {
        "tag": "CreateField",
        "model": "StripeProduct",
        "field": "id",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "StripeProduct",
            "field": "id"
          },
          "directive": "id"
        }
      },
      {
        "tag": "CreateField",
        "model": "StripeProduct",
        "field": "active",
        "type": "Boolean",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "StripeProduct",
        "field": "description",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "StripeProduct",
        "field": "name",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "StripeProduct",
        "field": "createdAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "StripeProduct",
            "field": "createdAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "StripeProduct",
            "field": "createdAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "StripeProduct",
            "field": "createdAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "StripeProduct",
            "field": "createdAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"created_at\""
      },
      {
        "tag": "CreateField",
        "model": "StripeProduct",
        "field": "updatedAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "StripeProduct",
            "field": "updatedAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "StripeProduct",
            "field": "updatedAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "StripeProduct",
            "field": "updatedAt"
          },
          "directive": "updatedAt"
        }
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "StripeProduct",
            "field": "updatedAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "StripeProduct",
            "field": "updatedAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"updated_at\""
      },
      {
        "tag": "CreateField",
        "model": "StripeProduct",
        "field": "ProductPrice",
        "type": "StripePrice",
        "arity": "List"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Model",
            "model": "StripeProduct"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Model",
            "model": "StripeProduct"
          },
          "directive": "map"
        },
        "argument": "name",
        "value": "\"stripe_products\""
      },
      {
        "tag": "CreateModel",
        "model": "StripePrice"
      },
      {
        "tag": "CreateField",
        "model": "StripePrice",
        "field": "id",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "StripePrice",
            "field": "id"
          },
          "directive": "id"
        }
      },
      {
        "tag": "CreateField",
        "model": "StripePrice",
        "field": "productId",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "StripePrice",
            "field": "productId"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "StripePrice",
            "field": "productId"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"product_id\""
      },
      {
        "tag": "CreateField",
        "model": "StripePrice",
        "field": "active",
        "type": "Boolean",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "StripePrice",
        "field": "currency",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "StripePrice",
        "field": "nickname",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "StripePrice",
        "field": "type",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "StripePrice",
        "field": "recurringInterval",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "StripePrice",
            "field": "recurringInterval"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "StripePrice",
            "field": "recurringInterval"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"recurring_interval\""
      },
      {
        "tag": "CreateField",
        "model": "StripePrice",
        "field": "createdAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "StripePrice",
            "field": "createdAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "StripePrice",
            "field": "createdAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "StripePrice",
            "field": "createdAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "StripePrice",
            "field": "createdAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"created_at\""
      },
      {
        "tag": "CreateField",
        "model": "StripePrice",
        "field": "updatedAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "StripePrice",
            "field": "updatedAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "StripePrice",
            "field": "updatedAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "StripePrice",
            "field": "updatedAt"
          },
          "directive": "updatedAt"
        }
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "StripePrice",
            "field": "updatedAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "StripePrice",
            "field": "updatedAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"updated_at\""
      },
      {
        "tag": "CreateField",
        "model": "StripePrice",
        "field": "Product",
        "type": "StripeProduct",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "StripePrice",
            "field": "Product"
          },
          "directive": "relation"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "StripePrice",
            "field": "Product"
          },
          "directive": "relation"
        },
        "argument": "fields",
        "value": "[productId]"
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "StripePrice",
            "field": "Product"
          },
          "directive": "relation"
        },
        "argument": "references",
        "value": "[id]"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Model",
            "model": "StripePrice"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Model",
            "model": "StripePrice"
          },
          "directive": "map"
        },
        "argument": "name",
        "value": "\"stripe_prices\""
      },
      {
        "tag": "DeleteModel",
        "model": "Product"
      },
      {
        "tag": "DeleteModel",
        "model": "ProductPrice"
      },
      {
        "tag": "UpdateField",
        "model": "StripePrice",
        "field": "nickname",
        "arity": "Optional"
      },
      {
        "tag": "UpdateField",
        "model": "StripePrice",
        "field": "recurringInterval",
        "arity": "Optional"
      },
      {
        "tag": "CreateModel",
        "model": "UserSubscription"
      },
      {
        "tag": "CreateField",
        "model": "UserSubscription",
        "field": "id",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "UserSubscription",
            "field": "id"
          },
          "directive": "id"
        }
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "UserSubscription",
            "field": "id"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "UserSubscription",
            "field": "id"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "uuid()"
      },
      {
        "tag": "CreateField",
        "model": "UserSubscription",
        "field": "uid",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "UserSubscription",
            "field": "uid"
          },
          "directive": "unique"
        }
      },
      {
        "tag": "CreateField",
        "model": "UserSubscription",
        "field": "product",
        "type": "SubscribableProduct",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "UserSubscription",
        "field": "currentPeriodEnd",
        "type": "DateTime",
        "arity": "Optional"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "UserSubscription",
            "field": "currentPeriodEnd"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "UserSubscription",
            "field": "currentPeriodEnd"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"current_period_end\""
      },
      {
        "tag": "CreateField",
        "model": "UserSubscription",
        "field": "createdAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "UserSubscription",
            "field": "createdAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "UserSubscription",
            "field": "createdAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "UserSubscription",
            "field": "createdAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "UserSubscription",
            "field": "createdAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"created_at\""
      },
      {
        "tag": "CreateField",
        "model": "UserSubscription",
        "field": "updatedAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "UserSubscription",
            "field": "updatedAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "UserSubscription",
            "field": "updatedAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "UserSubscription",
            "field": "updatedAt"
          },
          "directive": "updatedAt"
        }
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "UserSubscription",
            "field": "updatedAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "UserSubscription",
            "field": "updatedAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"updated_at\""
      },
      {
        "tag": "CreateField",
        "model": "UserSubscription",
        "field": "User",
        "type": "User",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "UserSubscription",
            "field": "User"
          },
          "directive": "relation"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "UserSubscription",
            "field": "User"
          },
          "directive": "relation"
        },
        "argument": "fields",
        "value": "[uid]"
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "UserSubscription",
            "field": "User"
          },
          "directive": "relation"
        },
        "argument": "references",
        "value": "[id]"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Model",
            "model": "UserSubscription"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Model",
            "model": "UserSubscription"
          },
          "directive": "map"
        },
        "argument": "name",
        "value": "\"subscriptions\""
      },
      {
        "tag": "DeleteModel",
        "model": "Subscription"
      },
      {
        "tag": "UpdateField",
        "model": "User",
        "field": "Subscription",
        "type": "UserSubscription"
      },
      {
        "tag": "CreateModel",
        "model": "PremiumPrice"
      },
      {
        "tag": "CreateField",
        "model": "PremiumPrice",
        "field": "id",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "PremiumPrice",
            "field": "id"
          },
          "directive": "id"
        }
      },
      {
        "tag": "CreateField",
        "model": "PremiumPrice",
        "field": "productId",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "PremiumPrice",
            "field": "productId"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "PremiumPrice",
            "field": "productId"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"product_id\""
      },
      {
        "tag": "CreateField",
        "model": "PremiumPrice",
        "field": "active",
        "type": "Boolean",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "PremiumPrice",
        "field": "currency",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "PremiumPrice",
        "field": "nickname",
        "type": "String",
        "arity": "Optional"
      },
      {
        "tag": "CreateField",
        "model": "PremiumPrice",
        "field": "type",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateField",
        "model": "PremiumPrice",
        "field": "recurringInterval",
        "type": "String",
        "arity": "Optional"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "PremiumPrice",
            "field": "recurringInterval"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "PremiumPrice",
            "field": "recurringInterval"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"recurring_interval\""
      },
      {
        "tag": "CreateField",
        "model": "PremiumPrice",
        "field": "createdAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "PremiumPrice",
            "field": "createdAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "PremiumPrice",
            "field": "createdAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "PremiumPrice",
            "field": "createdAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "PremiumPrice",
            "field": "createdAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"created_at\""
      },
      {
        "tag": "CreateField",
        "model": "PremiumPrice",
        "field": "updatedAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "PremiumPrice",
            "field": "updatedAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "PremiumPrice",
            "field": "updatedAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "PremiumPrice",
            "field": "updatedAt"
          },
          "directive": "updatedAt"
        }
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "PremiumPrice",
            "field": "updatedAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "PremiumPrice",
            "field": "updatedAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"updated_at\""
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Model",
            "model": "PremiumPrice"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Model",
            "model": "PremiumPrice"
          },
          "directive": "map"
        },
        "argument": "name",
        "value": "\"premium_prices\""
      },
      {
        "tag": "CreateField",
        "model": "PremiumPrice",
        "field": "recurringIntervalCount",
        "type": "Int",
        "arity": "Optional"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "PremiumPrice",
            "field": "recurringIntervalCount"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "PremiumPrice",
            "field": "recurringIntervalCount"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"recurring_interval_count\""
      },
      {
        "tag": "CreateField",
        "model": "PremiumPrice",
        "field": "unitAmount",
        "type": "Int",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "PremiumPrice",
            "field": "unitAmount"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "PremiumPrice",
            "field": "unitAmount"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"unit_amount\""
      },
      {
        "tag": "CreateField",
        "model": "PremiumPrice",
        "field": "unitAmountDecimal",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "PremiumPrice",
            "field": "unitAmountDecimal"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "PremiumPrice",
            "field": "unitAmountDecimal"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"unit_amount_decimal\""
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "PremiumPrice",
            "field": "unitAmount"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "PremiumPrice",
            "field": "unitAmount"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "1"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "PremiumPrice",
            "field": "unitAmountDecimal"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "PremiumPrice",
            "field": "unitAmountDecimal"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "\"\""
      },
      {
        "tag": "UpdateField",
        "model": "PremiumPrice",
        "field": "unitAmount",
        "arity": "Optional"
      },
      {
        "tag": "DeleteDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "PremiumPrice",
            "field": "unitAmount"
          },
          "directive": "default"
        }
      },
      {
        "tag": "UpdateField",
        "model": "PremiumPrice",
        "field": "unitAmountDecimal",
        "arity": "Optional"
      },
      {
        "tag": "DeleteDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "PremiumPrice",
            "field": "unitAmountDecimal"
          },
          "directive": "default"
        }
      },
      {
        "tag": "DeleteField",
        "model": "PremiumPrice",
        "field": "unitAmountDecimal"
      },
      {
        "tag": "CreateModel",
        "model": "PremiumSubscription"
      },
      {
        "tag": "CreateField",
        "model": "PremiumSubscription",
        "field": "id",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "PremiumSubscription",
            "field": "id"
          },
          "directive": "id"
        }
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "PremiumSubscription",
            "field": "id"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "PremiumSubscription",
            "field": "id"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "uuid()"
      },
      {
        "tag": "CreateField",
        "model": "PremiumSubscription",
        "field": "uid",
        "type": "String",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "PremiumSubscription",
            "field": "uid"
          },
          "directive": "unique"
        }
      },
      {
        "tag": "CreateField",
        "model": "PremiumSubscription",
        "field": "currentPeriodEnd",
        "type": "DateTime",
        "arity": "Optional"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "PremiumSubscription",
            "field": "currentPeriodEnd"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "PremiumSubscription",
            "field": "currentPeriodEnd"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"current_period_end\""
      },
      {
        "tag": "CreateField",
        "model": "PremiumSubscription",
        "field": "createdAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "PremiumSubscription",
            "field": "createdAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "PremiumSubscription",
            "field": "createdAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "PremiumSubscription",
            "field": "createdAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "PremiumSubscription",
            "field": "createdAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"created_at\""
      },
      {
        "tag": "CreateField",
        "model": "PremiumSubscription",
        "field": "updatedAt",
        "type": "DateTime",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "PremiumSubscription",
            "field": "updatedAt"
          },
          "directive": "default"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "PremiumSubscription",
            "field": "updatedAt"
          },
          "directive": "default"
        },
        "argument": "",
        "value": "now()"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "PremiumSubscription",
            "field": "updatedAt"
          },
          "directive": "updatedAt"
        }
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "PremiumSubscription",
            "field": "updatedAt"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "PremiumSubscription",
            "field": "updatedAt"
          },
          "directive": "map"
        },
        "argument": "",
        "value": "\"updated_at\""
      },
      {
        "tag": "CreateField",
        "model": "PremiumSubscription",
        "field": "User",
        "type": "User",
        "arity": "Required"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Field",
            "model": "PremiumSubscription",
            "field": "User"
          },
          "directive": "relation"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "PremiumSubscription",
            "field": "User"
          },
          "directive": "relation"
        },
        "argument": "fields",
        "value": "[uid]"
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Field",
            "model": "PremiumSubscription",
            "field": "User"
          },
          "directive": "relation"
        },
        "argument": "references",
        "value": "[id]"
      },
      {
        "tag": "CreateDirective",
        "location": {
          "path": {
            "tag": "Model",
            "model": "PremiumSubscription"
          },
          "directive": "map"
        }
      },
      {
        "tag": "CreateArgument",
        "location": {
          "tag": "Directive",
          "path": {
            "tag": "Model",
            "model": "PremiumSubscription"
          },
          "directive": "map"
        },
        "argument": "name",
        "value": "\"premium_subscriptions\""
      },
      {
        "tag": "DeleteModel",
        "model": "StripeProduct"
      },
      {
        "tag": "DeleteModel",
        "model": "StripePrice"
      },
      {
        "tag": "DeleteModel",
        "model": "UserSubscription"
      },
      {
        "tag": "UpdateField",
        "model": "User",
        "field": "Subscription",
        "type": "PremiumSubscription"
      }
    ],
    "stepsToApply": [
      {}
    ],
    "sourceConfig": "generator client {\n  provider = \"prisma-client-js\"\n}\n\ndatasource postgresql {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nmodel User {\n  id               String   @id @default(uuid())\n  email            String?  @unique\n  emailVerified    Boolean  @default(false) @map(\"email_verified\")\n  password         String?\n  tokenVersion     Int      @default(1) @map(\"token_version\")\n  disabled         Boolean  @default(false)\n  isAdmin          Boolean  @default(false) @map(\"is_admin\")\n  googleId         String?  @unique @map(\"google_id\")\n  stripeCustomerId String?  @map(\"stripe_customer_id\")\n  createdAt        DateTime @default(now()) @map(\"created_at\")\n  updatedAt        DateTime @default(now()) @updatedAt @map(\"updated_at\")\n\n  Transactions        Transaction[]\n  Categories          Category[]\n  Budgets             Budget[]\n  Feedback            Feedback[]\n  Profile             Profile?\n  Log                 Log[]\n  TransactionSchedule TransactionSchedule[]\n  Subscription        PremiumSubscription?\n\n  @@map(name: \"users\")\n}\n\nmodel Profile {\n  uid            String   @id\n  displayName    String?  @map(\"display_name\")\n  photoUrl       String?  @map(\"photo_url\")\n  googlePhotoUrl String?  @map(\"google_photo_url\")\n  themeColor     String?  @map(\"theme_color\")\n  themeMode      String?  @map(\"theme_mode\")\n  createdAt      DateTime @default(now()) @map(\"created_at\")\n  updatedAt      DateTime @default(now()) @updatedAt @map(\"updated_at\")\n\n  User User @relation(fields: [uid], references: [id])\n\n  @@map(name: \"profiles\")\n}\n\nmodel Transaction {\n  id            String   @id @default(uuid())\n  uid           String\n  categoryId    String   @map(\"category_id\")\n  comment       String?\n  integerAmount Int      @map(\"integer_amount\")\n  time          DateTime\n  createdAt     DateTime @default(now()) @map(\"created_at\")\n  updatedAt     DateTime @default(now()) @updatedAt @map(\"updated_at\")\n  scheduleId    String?  @map(\"schedule_id\")\n\n  User     User                 @relation(fields: [uid], references: [id])\n  Category Category             @relation(fields: [categoryId], references: [id])\n  Schedule TransactionSchedule? @relation(fields: [scheduleId], references: [id])\n\n  @@map(name: \"transactions\")\n}\n\nmodel TransactionSchedule {\n  id                      String       @id @default(uuid())\n  uid                     String\n  categoryId              String       @map(\"category_id\")\n  comment                 String?\n  integerAmount           Int          @map(\"integer_amount\")\n  intervalType            IntervalType @map(\"interval_type\")\n  intervalEvery           Int          @default(1) @map(\"interval_every\")\n  firstOccurrence         DateTime     @map(\"first_occurrence\")\n  occurrences             Int?\n  createdAt               DateTime     @default(now()) @map(\"created_at\")\n  updatedAt               DateTime     @default(now()) @updatedAt @map(\"updated_at\")\n  latestCreatedOccurrence DateTime?    @map(\"latest_created_occurrence\")\n\n  User         User          @relation(fields: [uid], references: [id])\n  Category     Category      @relation(fields: [categoryId], references: [id])\n  Transactions Transaction[]\n\n  @@map(name: \"transaction_schedules\")\n}\n\nenum IntervalType {\n  DAY\n  WEEK\n  MONTH\n  YEAR\n}\n\nmodel Budget {\n  id            String   @id @default(uuid())\n  uid           String\n  label         String?\n  integerAmount Int      @map(\"integer_amount\")\n  createdAt     DateTime @default(now()) @map(\"created_at\")\n  updatedAt     DateTime @default(now()) @updatedAt @map(\"updated_at\")\n  periodMonths  Int      @default(1) @map(\"period_months\")\n\n  BudgetCategoryInclusions BudgetCategoryInclusion[]\n\n  User User @relation(fields: [uid], references: [id])\n\n  @@map(name: \"budgets\")\n}\n\nmodel BudgetCategoryInclusion {\n  budgetId   String @map(\"budget_id\")\n  categoryId String @map(\"category_id\")\n\n  Budget   Budget   @relation(fields: [budgetId], references: [id])\n  Category Category @relation(fields: [categoryId], references: [id])\n\n  @@id([categoryId, budgetId])\n}\n\nmodel Category {\n  id        String   @id @default(uuid())\n  uid       String\n  value     String\n  icon      String?\n  createdAt DateTime @default(now()) @map(\"created_at\")\n  updatedAt DateTime @default(now()) @updatedAt @map(\"updated_at\")\n\n  Transactions             Transaction[]\n  BudgetCategoryInclusions BudgetCategoryInclusion[]\n  TransactionSchedule      TransactionSchedule[]\n\n  User User @relation(fields: [uid], references: [id])\n\n  @@unique([uid, value], name: \"unique_uid_value\")\n  @@unique([uid, id], name: \"unique_uid_id\")\n  @@map(name: \"categories\")\n}\n\nmodel Feedback {\n  id      String  @id @default(uuid())\n  uid     String\n  message String?\n\n  User User @relation(fields: [uid], references: [id])\n}\n\nmodel Log {\n  id         String   @id @default(uuid())\n  uid        String?\n  type       String\n  message    String\n  data       String\n  stackTrace String   @map(\"stack_trace\")\n  device     String\n  timestamp  Int\n  timestring String\n  createdAt  DateTime @default(now()) @map(\"created_at\")\n  href       String\n\n  User User? @relation(fields: [uid], references: [id])\n}\n\nmodel Config {\n  key   String @id\n  value String\n}\n\n// Subscriptions\nmodel PremiumSubscription {\n  id               String    @id @default(uuid())\n  uid              String    @unique\n  currentPeriodEnd DateTime? @map(\"current_period_end\")\n  createdAt        DateTime  @default(now()) @map(\"created_at\")\n  updatedAt        DateTime  @default(now()) @updatedAt @map(\"updated_at\")\n\n  User User @relation(fields: [uid], references: [id])\n\n  @@map(name: \"premium_subscriptions\")\n}\n\nmodel PremiumPrice {\n  id                     String   @id\n  unitAmount             Int?     @map(\"unit_amount\")\n  productId              String   @map(\"product_id\")\n  active                 Boolean\n  currency               String\n  nickname               String?\n  type                   String\n  recurringInterval      String?  @map(\"recurring_interval\")\n  recurringIntervalCount Int?     @map(\"recurring_interval_count\")\n  createdAt              DateTime @default(now()) @map(\"created_at\")\n  updatedAt              DateTime @default(now()) @updatedAt @map(\"updated_at\")\n\n  @@map(name: \"premium_prices\")\n}\n\n// @DEPRECATED\nenum SubscribableProduct {\n  PREMIUM\n}\n"
  }
}
```

## Stack Trace
```bash
Jun 28 14:57:20.421  INFO migration_engine: Starting migration engine RPC server git_hash="cf0680a1bfe8d5e743dc659cc7f08009f9587d58"
Jun 28 14:57:20.669  INFO quaint::single: Starting a postgresql connection.
Jun 28 14:57:21.205  INFO ListMigrations: migration_core::commands::list_migrations: Returning 33 migrations (0 pending).
```
