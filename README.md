# OdinLabs

This project is a full-stack web application designed for competitive programming and coding contests. It features a client-side built with React, TypeScript, and Vite, and a server-side built with Node.js and Express. The application allows users to create, manage, and participate in coding contests, solve problems, and submit code for evaluation.

## Features

### Client-Side (Frontend)

- **User Authentication and Authorization**: Secure user authentication and authorization.
- **Contest Management**: Create and manage coding contests.
- **Problem Solving and Code Execution**: Solve coding problems and execute code in various languages.
- **Real-time Features**: Live updates and notifications using Socket.io.
- **Code Editor**: Provided Monaco Code Editor for writing and executing code.
- **Rich Text Editing**: Rich text editing for problem descriptions and contest details using ReactQuill.
- **Responsive UI**: User-friendly interface designed with Tailwind CSS and DaisyUI.
- **State Management**: Efficient state management using Redux.

### Server-Side (Backend)

- **Database Connection**: Connect to MongoDB using Mongoose.
- **API Endpoints**: RESTful API design for handling user, contest, and problem data.
- **Real-time Communication**: Real-time functionalities using Socket.io.
- **Code Execution**: Integration with external code execution services(Judge-0).

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Redux, Tailwind CSS, DaisyUI, ReactQuill, Socket.io-client
- **Backend**: Node.js, Express, Mongoose, Socket.io
- **Database**: MongoDB
- **Other Tools**: Judge-0 API

## Setup Instructions

### Prerequisites

- Node.js (>= 14.x)
- npm or yarn
- MongoDB

### Environment Variables

Create a `.env` file in both the [`client`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FUsers%2Fkushalpatel%2FDesktop%2FCollege%20Stuff%2FDSA-TA%2FOdinLabs%2Fclient%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%5D "/Users/kushalpatel/Desktop/College Stuff/DSA-TA/OdinLabs/client") and [`server`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FUsers%2Fkushalpatel%2FDesktop%2FCollege%20Stuff%2FDSA-TA%2FOdinLabs%2Fserver%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%5D "/Users/kushalpatel/Desktop/College Stuff/DSA-TA/OdinLabs/server") directories with the following variables:

#### Client `.env`

```
VITE_RAPIDAPI_HOST=your_rapidapi_host
VITE_RAPIDAPI_KEY=your_rapidapi_key
```

#### Server `.env`

```
MONGODB_URI=your_mongodb_uri
VITE_RAPIDAPI_HOST=your_rapidapi_host
VITE_RAPIDAPI_KEY=your_rapidapi_key
PORT=8000
```

### Installation

1. **Clone the repository**

```sh
git clone https://github.com/KushalP47/OdinLabs.git
cd OdinLabs
```

2. **Install dependencies for client**

```sh
cd client
npm install
```

3. **Install dependencies for server**

```sh
cd ../server
npm install
```

### Running the Application

1. **Start the server**

```sh
cd server
npm run dev
```

2. **Start the client**

```sh
cd ../client
npm run dev
```

### Building the Application

1. **Start the server**

```sh
cd server
npm run build
```

2. **Start the client**

```sh
cd ../client
npm run build
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.