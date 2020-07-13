### Useful commands

Manually invoke appsync function:

```bash
aws lambda invoke --function-name dailyidea-mail-processing-dev-requestIdeasMail --payload '{"email":"ACCOUNT_EMAIL_HERE"}' t.txt
``` 

Test weekly stats:
```bash
aws lambda invoke --function-name dailyidea-mail-processing-dev-weeklyStats t.txt
```
