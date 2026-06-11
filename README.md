# Crazy Discgolf

Turn every hole into a challenge round. Built by and for disc golfers who want more fun, more pressure, and more stories after the round.

Crazy Discgolf is a party-style scorekeeper and challenge generator for disc golfers.
It adds controlled chaos to your round by rolling shot modifiers every throw, so each hole feels fresh, competitive, and funny.

Built for players who already love the sport, this app is designed for casual rounds, doubles nights, league side-games, and "let's make this hole weird" moments.

## Visuals

Add real app media here so visitors instantly understand the experience.

### Screenshot Placeholders

- Hero screen (home/setup): `docs/images/readme-hero-setup.png`
- In-round gameplay screen: `docs/images/readme-gameplay.png`
- Results screen: `docs/images/readme-results.png`

### GIF Placeholder

- Quick gameplay loop (setup -> roll -> score): `docs/images/readme-gameplay-loop.gif`

Example embed format:

```md
![Crazy Discgolf setup screen](docs/images/readme-hero-setup.png)
![Crazy Discgolf gameplay](docs/images/readme-gameplay.png)
![Crazy Discgolf results](docs/images/readme-results.png)
![Crazy Discgolf gameplay loop](docs/images/readme-gameplay-loop.gif)
```

## Why Disc Golfers Use It

- Keep rounds fun without making setup complicated
- Mix strategy and randomness with rerolls and challenge options
- Support solo sessions and multiplayer groups
- Add custom modifiers for your local course rules and inside jokes
- Save game progress and continue later

## Core Gameplay

1. Choose number of players, holes, and rerolls.
2. Enter player names.
3. Roll a challenge each throw (for example: Driver only, Roller, Non-dominant hand).
4. Track throw counts per hole and per player.
5. Review full game results at the end.

## Features

- Disc-golf-specific challenge pool
  - Driver, Mid-range, Putter, Roller, Opponent's Choice, Non-dominant Hand, Mulligan, and more
- Multiplayer-first flow
  - Built-in turn handling and player selection prompts
- Reroll system
  - Limited rerolls or unlimited mode for pure chaos rounds
- Custom challenge editor
  - Add, edit, and remove your own modifiers
- Persistent game state
  - Continue saved games after closing the app
- Mobile ads integration
  - Banner and interstitial placements configured for release flow

## Tech Stack

- Expo + React Native
- TypeScript
- Expo Router (file-based routing)
- AsyncStorage for local persistence
- react-native-google-mobile-ads

## Run Locally

1. Install dependencies

```bash
npm install
```

2. Start the dev server

```bash
npm run start
```

3. Run on platform

```bash
npm run ios
npm run android
npm run web
```

## Quality Check

```bash
npm run lint
```

## Support and Privacy

- Support: https://fooaldrin.github.io/crazydiscgolf/support/
- Privacy: https://fooaldrin.github.io/crazydiscgolf/privacy/

## Contributing

Contributions are welcome, especially from disc golfers with ideas for new modifiers, better scoring flows, or tournament-friendly features.

If you have a suggestion or bug report, open an issue:
https://github.com/fooaldrin/crazydiscgolf/issues
