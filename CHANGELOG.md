# Changelog

## 0.1.0 (2023-11-19)


### Features

* Added basic monitoring ([895242f](https://github.com/SachsenspieltCoding/montimus/commit/895242fe02934170e9efad4e5a0a0e08ec36a66f))
* **backend-rest:** Added Monitor Endpoint ([0ddd1ba](https://github.com/SachsenspieltCoding/montimus/commit/0ddd1ba799f7f569ae9ffeadff7017375d47a5e1))
* **backend-rest:** Added zod for validation ([36b7c5d](https://github.com/SachsenspieltCoding/montimus/commit/36b7c5dae1a8178e707c707feb417f811939e260))
* **backend:** Added basic login system with JWT ([f44d875](https://github.com/SachsenspieltCoding/montimus/commit/f44d875ccb482df1174a79650deb764ffb5fdbfb))
* **backend:** Added basic RESTful API routing system ([8e3f3c4](https://github.com/SachsenspieltCoding/montimus/commit/8e3f3c4031290147d2d18b87128d48b02aa10338))
* **backend:** Added events (status changes) ([aa4a8c9](https://github.com/SachsenspieltCoding/montimus/commit/aa4a8c969f59a3aeb372256b1d20c56aecb4804b))
* **backend:** Added historical data endpoint with ping data ([c5b8825](https://github.com/SachsenspieltCoding/montimus/commit/c5b8825828a6f2f6f79e503109c0094322686480))
* **backend:** Added prisma.js for Database Integration ([9dd2d4f](https://github.com/SachsenspieltCoding/montimus/commit/9dd2d4fd3444cdaaa8146af7106a02b9c1b358b1))


### Bug Fixes

* **backend-monitoring:** HttpMonitor now doesn't crash server if wrong URL ([36b7c5d](https://github.com/SachsenspieltCoding/montimus/commit/36b7c5dae1a8178e707c707feb417f811939e260))
* **backend-rest:** Get Route is now "/"-insensitive at the end of the route ([36b7c5d](https://github.com/SachsenspieltCoding/montimus/commit/36b7c5dae1a8178e707c707feb417f811939e260))
* **backend:** Fixed MonitoringMonitor implementation ([e268c43](https://github.com/SachsenspieltCoding/montimus/commit/e268c43c25718636b760623f60533644f318575f))
* **backend:** If Route not found by authenticator, no next() is called ([36b7c5d](https://github.com/SachsenspieltCoding/montimus/commit/36b7c5dae1a8178e707c707feb417f811939e260))
* **ci:** Fixed typo in openapi.yml ([88c75d0](https://github.com/SachsenspieltCoding/montimus/commit/88c75d06e0a42dd3e68694617b18e13aee0690c3))


### Miscellaneous Chores

* Updated Release-Please ([04655f7](https://github.com/SachsenspieltCoding/montimus/commit/04655f76113f73bf7a4b7a99774be16639581747))
