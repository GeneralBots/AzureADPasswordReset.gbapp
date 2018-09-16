# AzureADPasswordReset.gbapp
Custom dialogs for reseting user password in Azure Active Directory, Office 365, Dynamics 365 or any app published through Azure AD.

According to Dan Kershaw, the only way to reset an user's password programaticaly is to use changePassword within user context that has the Directory.AccessAsUser.All permission.

[Dan Kershaw – MSFT](https://stackoverflow.com/questions/44313884/insufficient-privileges-for-password-reset)

>Change Password - in Microsoft Graph (although not documented) you'll find the "changePassword" method on user - ../users/{id}/changePassword, which takes the old password and a new password. This API works ONLY for the signed-in user (so it requires the delegated OAuth2 code flow). It requires an admin to consent for Directory.AccessAsUser.All (although we are looking at adding a more granular permission).

## Bot Administrator - Save Token to the Database

So the Bot provides an **admin** mode allowing the user having the Directory.AccessAsUser.All permission to be logged on Administrative interface to obtain and save its token into the database.

![General Bot Logo](https://raw.githubusercontent.com/pragmatismo-io/AzureADPasswordReset.gbapp/master/docs/admin.gif)

## Bot User - Reset Password

With the access token stored in the database, any user can access anonymously  the 
bot and through a combination of e-mail and password will be able to reset her or his password.

![General Bot Logo](https://raw.githubusercontent.com/pragmatismo-io/AzureADPasswordReset.gbapp/master/docs/password.gif)

### References

1. https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-graph-api
2. https://developer.microsoft.com/en-us/graph/docs/api-reference/v1.0/api/user_update
3. https://stackoverflow.com/questions/43625460/change-password-for-azure-ad-using-microsoft-graph
4. https://stackoverflow.com/questions/44313884/insufficient-privileges-for-password-reset
