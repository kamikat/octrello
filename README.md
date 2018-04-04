Octrello
--------

Integrate (**not sync**) Trello with GitHub.

Manipulating Trello cards with commit message.

### Usage ###

- Syntax `see #Card-3` will comment on the card saying that the card is mentioned by the commit.
- Syntax `fulfill #Card-5` will comment on the card saying that the card is fulfilled and add green label to the card.
- Support multiple action from single commit `see #card-3, #card-5` syntax.
- Reverts a "fulfillment" commit will remove the added green label from the card.

### Setup ###

Clone the repository and execute command `npm start` after `npm install` should setup the server listening events from GitHub.
Server port can be changed with `PORT` environment variable.

Login into Trello and visit <https://trello.com/1/appKey/generate> to acquire an app key.

Visit following address for `<user-token>` (replacing `<app-key>` with the generated one):

    https://trello.com/1/authorize?key=<trello-app-key>&name=Octrello&expiration=never&response_type=token&scope=read,write

Then, create a [webhook](https://developer.github.com/webhooks/creating/#setting-up-a-webhook) for the GitHub repository:

    http://octrello.example.org:8033/hooks/octrello/label-card-in-board/<trello-board-id>?key=<trello-app-key>&token=<user-token>

Set `application/json` for `Content type` and choose `Just the push event`.

Cheers :beers

### Contribution ###

Issues are always welcomed if you have any exciting idea or advice on it :)

### License ###

(The MIT License)

