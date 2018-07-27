# AzureADResetPassword.gbapp
Custom dialogs for reseting user password in Azure Active Directory, Office 365, Dynamics 365 or any app published through Azure AD.

**Dialog**

```
User>I would like to reset my password.
Bot>OK, I will get some information.
Bot>What's your name?
User>MyName
Bot>What's your recovery mobile number?
User>+55 21 9999-9999
Bot>Please confirm the code sent to your mobile.
User>392340
Bot>Your new password is '2osdfhu*j'.
User>Thank you.
```

#API#

1. https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-graph-api
2. https://developer.microsoft.com/en-us/graph/docs/api-reference/v1.0/api/user_update

#Articles#

1. https://stackoverflow.com/questions/43625460/change-password-for-azure-ad-using-microsoft-graph
2. https://stackoverflow.com/questions/44313884/insufficient-privileges-for-password-reset
