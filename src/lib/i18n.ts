import { Language } from '@/components/ui/language-switcher';

interface TranslationStrings {
  title: string;
  subtitle: string;
  slogan: string;
  danceQuote: string;
  tips: string[];
  login: string;
  register: string;
  username: string;
  password: string;
  displayName: string;
  confirmPassword: string;
  usernameRequired: string;
  passwordRequired: string;
  displayNameRequired: string;
  passwordMismatch: string;
  loginSuccess: string;
  loginFailed: string;
  registerSuccess: string;
  registerFailed: string;
  welcome: string;
  checkCredentials: string;
  accountCreated: string;
  usernameTaken: string;
  noAccount: string;
  hasAccount: string;
  registerNow: string;
  loginNow: string;
  inputUsername: string;
  inputPassword: string;
  chooseUsername: string;
  inputDisplayName: string;
  createPassword: string;
  confirmPasswordPlaceholder: string;
  loggingIn: string;
  registering: string;
}

type Translations = {
  [key in Language]: TranslationStrings;
};

export const translations: Translations = {
  zh: {
    title: '舞音社区',
    subtitle: '以歌会友，连接音乐灵魂',
    slogan: '让音乐跳动，让舞步飞扬！',
    danceQuote: '准备好了吗？让我们一起在音乐中舞动！',
    tips: [
      '跟随节奏，展现你的舞步！',
      '即刻起舞，让音乐带你飞！',
      '和全球舞者一起狂欢！',
      '在这里，每个人都是舞台的主角！'
    ],
    login: '登录',
    register: '注册',
    username: '用户名',
    password: '密码',
    displayName: '显示名称',
    confirmPassword: '确认密码',
    usernameRequired: '用户名至少需要3个字符',
    passwordRequired: '密码至少需要6个字符',
    displayNameRequired: '显示名称至少需要2个字符',
    passwordMismatch: '两次输入的密码不匹配',
    loginSuccess: '登录成功',
    loginFailed: '登录失败',
    registerSuccess: '注册成功',
    registerFailed: '注册失败',
    welcome: '欢迎回来！',
    checkCredentials: '请检查您的用户名和密码',
    accountCreated: '您的账户已创建，请登录',
    usernameTaken: '可能该用户名已被使用',
    noAccount: '没有账号？',
    hasAccount: '已有账号？',
    registerNow: '立即注册',
    loginNow: '去登录',
    inputUsername: '输入您的用户名',
    inputPassword: '输入您的密码',
    chooseUsername: '选择一个用户名',
    inputDisplayName: '您希望如何被称呼',
    createPassword: '创建一个密码',
    confirmPasswordPlaceholder: '再次输入您的密码',
    loggingIn: '登录中...',
    registering: '注册中...',
  },
  en: {
    title: 'Dance Music Community',
    subtitle: 'Connect Musical Souls Through Songs',
    slogan: 'Let the Music Move, Let the Dance Flow!',
    danceQuote: 'Ready? Let\'s Dance with the Music!',
    tips: [
      'Follow the rhythm, show your moves!',
      'Start dancing, let the music take you high!',
      'Party with dancers worldwide!',
      'Here, everyone is the star of the stage!'
    ],
    login: 'Login',
    register: 'Register',
    username: 'Username',
    password: 'Password',
    displayName: 'Display Name',
    confirmPassword: 'Confirm Password',
    usernameRequired: 'Username must be at least 3 characters',
    passwordRequired: 'Password must be at least 6 characters',
    displayNameRequired: 'Display name must be at least 2 characters',
    passwordMismatch: 'Passwords do not match',
    loginSuccess: 'Login Successful',
    loginFailed: 'Login Failed',
    registerSuccess: 'Registration Successful',
    registerFailed: 'Registration Failed',
    welcome: 'Welcome back!',
    checkCredentials: 'Please check your username and password',
    accountCreated: 'Your account has been created, please login',
    usernameTaken: 'Username may already be taken',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    registerNow: 'Register Now',
    loginNow: 'Login Now',
    inputUsername: 'Enter your username',
    inputPassword: 'Enter your password',
    chooseUsername: 'Choose a username',
    inputDisplayName: 'How would you like to be called',
    createPassword: 'Create a password',
    confirmPasswordPlaceholder: 'Re-enter your password',
    loggingIn: 'Logging in...',
    registering: 'Registering...',
  },
}; 