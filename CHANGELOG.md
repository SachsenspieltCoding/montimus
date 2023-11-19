# Changelog

## 0.1.0 (2023-11-19)


### ✨ Features

* Added basic monitoring ([895242f](https://github.com/SachsenspieltCoding/montimus/commit/895242fe02934170e9efad4e5a0a0e08ec36a66f))
* **backend-rest:** Added Monitor Endpoint ([0ddd1ba](https://github.com/SachsenspieltCoding/montimus/commit/0ddd1ba799f7f569ae9ffeadff7017375d47a5e1))
* **backend-rest:** Added zod for validation ([36b7c5d](https://github.com/SachsenspieltCoding/montimus/commit/36b7c5dae1a8178e707c707feb417f811939e260))
* **backend:** Added basic login system with JWT ([f44d875](https://github.com/SachsenspieltCoding/montimus/commit/f44d875ccb482df1174a79650deb764ffb5fdbfb))
* **backend:** Added basic RESTful API routing system ([8e3f3c4](https://github.com/SachsenspieltCoding/montimus/commit/8e3f3c4031290147d2d18b87128d48b02aa10338))
* **backend:** Added events (status changes) ([aa4a8c9](https://github.com/SachsenspieltCoding/montimus/commit/aa4a8c969f59a3aeb372256b1d20c56aecb4804b))
* **backend:** Added historical data endpoint with ping data ([c5b8825](https://github.com/SachsenspieltCoding/montimus/commit/c5b8825828a6f2f6f79e503109c0094322686480))
* **backend:** Added prisma.js for Database Integration ([9dd2d4f](https://github.com/SachsenspieltCoding/montimus/commit/9dd2d4fd3444cdaaa8146af7106a02b9c1b358b1))


### 🐛 Bug Fixes

* **backend-monitoring:** HttpMonitor now doesn't crash server if wrong URL ([36b7c5d](https://github.com/SachsenspieltCoding/montimus/commit/36b7c5dae1a8178e707c707feb417f811939e260))
* **backend-rest:** Get Route is now "/"-insensitive at the end of the route ([36b7c5d](https://github.com/SachsenspieltCoding/montimus/commit/36b7c5dae1a8178e707c707feb417f811939e260))
* **backend:** Fixed MonitoringMonitor implementation ([e268c43](https://github.com/SachsenspieltCoding/montimus/commit/e268c43c25718636b760623f60533644f318575f))
* **backend:** If Route not found by authenticator, no next() is called ([36b7c5d](https://github.com/SachsenspieltCoding/montimus/commit/36b7c5dae1a8178e707c707feb417f811939e260))
* **ci:** Fixed typo in openapi.yml ([88c75d0](https://github.com/SachsenspieltCoding/montimus/commit/88c75d06e0a42dd3e68694617b18e13aee0690c3))


### 📚 Documentation

* Added note that OpenAPI YAML is outdated ([ac47eef](https://github.com/SachsenspieltCoding/montimus/commit/ac47eeffbb918e48954efcdbfb9c9d5458c49350))
* **backend:** Added openapi.yml ([73ea416](https://github.com/SachsenspieltCoding/montimus/commit/73ea4166b3dc110a1cf9b76d9be646440c812e9b))


### 🛠️ Code Refactoring

* **backend:** Revert logging refactoring ([526275a](https://github.com/SachsenspieltCoding/montimus/commit/526275ac10d53e9097a9c1f54e1962012bdfcd11))
* Refactored logging system ([895242f](https://github.com/SachsenspieltCoding/montimus/commit/895242fe02934170e9efad4e5a0a0e08ec36a66f))
* Refactored Monitoring System ([ac47eef](https://github.com/SachsenspieltCoding/montimus/commit/ac47eeffbb918e48954efcdbfb9c9d5458c49350))


### 🧹 Chores

* Added ESLint and Prettier ([b36d983](https://github.com/SachsenspieltCoding/montimus/commit/b36d983de1fc3b969d79fc7f5fd48e078aaac058))
* Added Logos ([ea458fe](https://github.com/SachsenspieltCoding/montimus/commit/ea458fe4760d49ea4b7b127551d6c72a3d92faad))
* **backend:** Changed Log-Type to info for monitoring CUD ([6210c8b](https://github.com/SachsenspieltCoding/montimus/commit/6210c8bc07d674c25e9b7e817cb3622e885f0cf4))
* bootstrap releases for path: . ([b9ef649](https://github.com/SachsenspieltCoding/montimus/commit/b9ef649e42569e9f1a2cb12ba1ff071c3afeb604))
* Format Codebase ([b36d983](https://github.com/SachsenspieltCoding/montimus/commit/b36d983de1fc3b969d79fc7f5fd48e078aaac058))
* Test release-please ([b774d0b](https://github.com/SachsenspieltCoding/montimus/commit/b774d0b487ab58c49e1af730fd546cc98f07ab11))
* Update Release Please ([97f7ae7](https://github.com/SachsenspieltCoding/montimus/commit/97f7ae7046a540b67ffac70dba17c3c6bbbe66bd))
* Updated Release-Please ([04655f7](https://github.com/SachsenspieltCoding/montimus/commit/04655f76113f73bf7a4b7a99774be16639581747))
* Updated Release-Please config ([08b6dee](https://github.com/SachsenspieltCoding/montimus/commit/08b6dee67ab50ed97921517d82a2fde38ce8620d))
* Updated Release-Please PR template ([b27b832](https://github.com/SachsenspieltCoding/montimus/commit/b27b832d21283d2247c2b8d81fde23c87624924c))


### 🛠️ Continuous Integration

* Added release-please ([64f14fb](https://github.com/SachsenspieltCoding/montimus/commit/64f14fb03ca71a889968f9ed0c7a48edbb192874))
* Further updates ([0847ee9](https://github.com/SachsenspieltCoding/montimus/commit/0847ee9f8acdfcbe610dea2b63aca0a20a9a9786))
* Release Please now updates openapi version of backend API ([106b60f](https://github.com/SachsenspieltCoding/montimus/commit/106b60f8406594aee647bb917c77cd19d24cf415))
* **release-please:** Include backend package.json ([1e8dc62](https://github.com/SachsenspieltCoding/montimus/commit/1e8dc6201bb71b447e524b14e704fb2b281d6372))
* **release-please:** Use config maybe ([66767d4](https://github.com/SachsenspieltCoding/montimus/commit/66767d4c75e2de330d5d9ab005f0b36e58097059))
* Updated Release-Please to new project structure ([50ae8d3](https://github.com/SachsenspieltCoding/montimus/commit/50ae8d353d1a1e60899a3ade364af7a6f0877b19))
