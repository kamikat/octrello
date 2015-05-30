Octrello
--------

Integrate (**not sync**) Trello with GitHub.

Manipulating Trello cards with commit message.

### Usage ###

- Syntax `see #Card-3` will comment on the card saying that the card is mentioned by the commit.
- Syntax `fulfill #Card-5` will comment on the card saying that the card is fulfilled and add green label to the card.
- Support multiple action from single commit `see #card-3, #card-5` syntax.
- Reverts a "fulfillment" commit will remove the added green label from the card.

### Getting Started ###

Following steps will help setup a GitHub-Trello integration with server on `service.banana.moe`.
You can skip this section if you'd like to setup your own instance.

1. Login to your Trello account.
2. Visit [Authorization Page](https://trello.com/1/authorize?key=e46e4e1e983a424f5dd83497ac59190d&name=Octrello&expiration=never&response_type=token&scope=read,write) to get your **user token**.
3. Setup webhook in Repository's setting page `http://service.banana.moe/hooks/octrello/label-card-in-board/[your-trello-board-id]?key=e46e4e1e983a424f5dd83497ac59190d?token=[your-user-token]`

You can revoke your authorization anytime from Trello's Account Setting Page.

### Setup ###

Clone the repository and execute command `npm start` after `npm install` should setup the server listening events from GitHub.
Server port can be changed with `PORT` environment variable.

Login into Trello and visiting <https://trello.com/1/appKey/generate> to obtain your app key.

After the key is prepared, visit (replacing `[trello-app-key]` with your generated app key.

    https://trello.com/1/authorize?key=[trello-app-key]&name=Octrello&expiration=never&response_type=token&scope=read,write

Congratulations, here is the user token.

The final step, setup a new Webhook to your GitHub repository:

    http://[authority]/hooks/octrello/label-card-in-board/[your-trello-board-id]?key=[trello-app-key]&token=[user-token-with-read-write-scope-to-the-card-in-board]

### Contribution ###

Issues are always welcomed if you have any exciting idea or advice on it :)

### License ###

(The MIT License)

