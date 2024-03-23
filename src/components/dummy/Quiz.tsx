const Quiz = [
  {
    question: 'What is React Native?',
    options: [
      {
        id: '0',
        answer: 'A JavaScript framework for building native mobile apps ',
      },
      {
        id: '1',
        answer: 'A programming language for web development',
      },
      {
        id: '2',
        answer: 'A database management system',
      },
      {
        id: '3',
        answer: 'A design pattern for user interfaces',
      },
    ],
    correctAnswerIndex: 0,
    byOrder: '01',
  },
  {
    question:
      'What programming language is primarily used in React Native development?',
    options: [
      {
        id: '0',
        answer: 'JavaScript',
      },
      {
        id: '1',
        answer: 'Java',
      },
      {
        id: '2',
        answer: 'Python',
      },
      {
        id: '3',
        answer: 'Swift',
      },
    ],
    correctAnswerIndex: 0,
    byOrder: '02',
  },
  {
    question: 'Which platform(s) can you target with React Native?',
    options: [
      {
        id: '0',
        answer: 'iOS',
      },
      {
        id: '1',
        answer: 'Android',
      },
      {
        id: '2',
        answer: 'Both iOS and Android',
      },
      {
        id: '3',
        answer: 'None of the above',
      },
    ],
    correctAnswerIndex: 2,
    byOrder: '03',
  },
  {
    question: 'What is the purpose of JSX in React Native?',
    options: [
      {
        id: '0',
        answer: 'It is a styling language for React Native components.',
      },
      {
        id: '1',
        answer: 'It is a template language for defining user interfaces.',
      },
      {
        id: '2',
        answer: 'It is a state management library for React Native.',
      },
      {
        id: '3',
        answer: 'It is a build tool for bundling React Native applications.',
      },
    ],
    correctAnswerIndex: 1,
    byOrder: '04',
  },
  {
    question: 'How does React Native achieve cross-platform compatibility?',
    options: [
      {
        id: '0',
        answer: 'It compiles JavaScript code to native platform-specific code.',
      },
      {
        id: '1',
        answer: 'It uses a virtual machine to interpret JavaScript code.',
      },
      {
        id: '2',
        answer: 'It relies on platform-specific components and APIs.',
      },
      {
        id: '3',
        answer: 'It transpiles JavaScript code to Java or Swift.',
      },
    ],
    correctAnswerIndex: 2,
    byOrder: '05',
  },
  //start
  {
    question: 'How can you handle user input in React Native?',
    options: [
      {
        id: '0',
        answer: 'By using the TextInput component.',
      },
      {
        id: '1',
        answer: 'By using the Touchable components for buttons and gestures.',
      },
      {
        id: '2',
        answer: 'By using the Picker component for selecting options.',
      },
      {
        id: '3',
        answer: 'All of the above',
      },
    ],
    correctAnswerIndex: 3,
    byOrder: '06',
  },
  {
    question: 'What is the purpose of the React Native Bridge?',
    options: [
      {
        id: '0',
        answer:
          'It provides a way to communicate between JavaScript and native code.',
      },
      {
        id: '1',
        answer: 'It allows React Native components to be rendered natively.',
      },
      {
        id: '2',
        answer: 'It enables hot reloading in React Native.',
      },
      {
        id: '3',
        answer: 'It manages state and props in React Native.',
      },
    ],
    correctAnswerIndex: 0,
    byOrder: '07',
  },
  {
    question: 'How can you style components in React Native?',
    options: [
      {
        id: '0',
        answer: 'By using inline styles similar to CSS.',
      },
      {
        id: '1',
        answer: ' By using external stylesheets.',
      },
      {
        id: '2',
        answer: 'By using styled components library.',
      },
      {
        id: '3',
        answer: ' All of the above',
      },
    ],
    correctAnswerIndex: 3,
    byOrder: '08',
  },
  {
    question: 'What is the purpose of the AsyncStorage API in React Native?',
    options: [
      {
        id: '0',
        answer:
          'It allows you to store and retrieve data persistently on the device.',
      },
      {
        id: '1',
        answer: ' It provides access to the device is file system.',
      },
      {
        id: '2',
        answer: 'It manages network requests in React Native.',
      },
      {
        id: '3',
        answer: 'It controls the navigation stack in React Native.',
      },
    ],
    correctAnswerIndex: 0,
    byOrder: '09',
  },
  {
    question: 'How can you handle network requests in React Native?',
    options: [
      {
        id: '0',
        answer: 'By using the built-in fetch API.',
      },
      {
        id: '1',
        answer: 'By using third-party libraries like Axios.',
      },
      {
        id: '2',
        answer: 'By using the XMLHttpRequest object.',
      },
      {
        id: '3',
        answer: 'All of the above.',
      },
    ],
    correctAnswerIndex: 3,
    byOrder: '10',
  },
];

export default Quiz;
