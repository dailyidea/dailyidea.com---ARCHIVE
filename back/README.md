# Backend Applications

This folder contains 3 backend applications:

- "appsync": general application API
- "mail-processing": sending sheduled emails, recieving incoming emails
- "users": users authentication


# Testing emails

---

## /back/users app emails

### Sign Up

First register user at cognito, client-id can be found in front app .env file.

User email should not already exists (you can use +{any number} with gmail like email+123@gmail.com)

```bash
aws cognito-idp sign-up --client-id 6eojplv1g5h1nrvdtho56s3g7f --username email+123@gmail.com --password PASSWORD --user-attributes Name="name",Value="John Doe"
```
Use this user email for testing signup emails.

#### Signup (register)

```bash
yarn run-dev requestLogin --data '{"body":{"email":"email+123@gmail.com"}}'
```

#### Magic link (registration) with comment

First it will require to create a temporary comment with unique id.

```bash
aws dynamodb put-item --table-name dailyidea-comments-temporary-dev --item '{"commentId":{"S":"someuniqid123"},"userId":{"S":"23926672-711f-4def-a496-53c7210013e2"},"body":{"S":"Comment body"},"ideaId":{"S":"0e6f1e3e-7b2f-4174-abcf-84e6038ee619"},"ideaName":{"S":"Some idea"},"ideaOwnerId":{"S":"23926672-711f-4def-a496-53c7210013e2"}}'
```

```bash
yarn run-dev requestLogin --data '{"body":{"email":"email+123@gmail.com","commentId":"someuniqid123"}}'
```

#### Magic link (registration) with idea save

```bash
yarn run-dev requestLogin --data '{"body":{"email":"email+123@gmail.com","ideaToSaveId":"0e6f1e3e-7b2f-4174-abcf-84e6038ee619"}}'
```


### Login

#### Require login

```bash
yarn run-dev requestLogin --data '{"body":{"email":"email+123@gmail.com"}}'
```
Email should be already registered

#### Require login mobile

```bash
yarn run-dev requestLogin --data '{"body":{"email":"email+123@gmail.com","isMobile":true}}'
```
Email should be already registered


#### Require login with comment

First it will require to create a temporary comment with unique id.

```bash
aws dynamodb put-item --table-name dailyidea-comments-temporary-dev --item '{"commentId":{"S":"someuniqid123"},"userId":{"S":"23926672-711f-4def-a496-53c7210013e2"},"body":{"S":"Comment body"},"ideaId":{"S":"0e6f1e3e-7b2f-4174-abcf-84e6038ee619"},"ideaName":{"S":"Some idea"},"ideaOwnerId":{"S":"23926672-711f-4def-a496-53c7210013e2"}}'
```

```bash
yarn run-dev requestLogin --data '{"body":{"email":"email+123@gmail.com","commentId":"someuniqid123"}}'
```
Email should be already registered


#### Require login with idea save

```bash
yarn run-dev requestLogin --data '{"body":{"email":"email+123@gmail.com","ideaToSaveId":"0e6f1e3e-7b2f-4174-abcf-84e6038ee619"}}'
```
Email should be already registered

---

## /back/mail-processing app emails

#### Request daily idea

It will send email to all users

```bash
aws lambda invoke --function-name dailyidea-mail-processing-dev-requestIdeasMail t.txt
```

#### Weekly stats

It will send email to all users

```bash
aws lambda invoke --function-name dailyidea-mail-processing-dev-weeklyStats t.txt
```

## /back/appsync app emails


#### Ideas digest

This can be done via browser https://beta.dailyidea.com/send-digest , fill at least two ideas and a passcode "saprobregu" (for dev server).


#### Share idea

This can be done via browser https://beta.dailyidea.com, find any idea and click share button.

