const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const bodyParser = express.json()

const languageRouter = express.Router()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const nextWord = await LanguageService.getNext(
        req.app.get('db'),
        req.language.head
      );
      res.json({
        nextWord: nextWord.original,
        wordCorrectCount: nextWord.correct_count,
        wordIncorrectCount: nextWord.incorrect_count,
        totalScore: req.language.total_score,
      });
    }
    catch (error) {
      next (error)
    }
  })

languageRouter
  .route('/guess')
  .post(bodyParser, async (req, res, next) => {
    if (!Object.keys(req.body).includes('guess')) {
      return res.status(400).json({
        error: `Missing 'guess' in request body`,
      });
    }
    const words = await LanguageService.getLanguageWords(
      req.app.get('db'),
      req.language.id
    );
    const wordList = LanguageService.fillWordList(
      req.app.get('db'),
      req.language,
      words
    );
    console.log(words, wordList)
    if (req.body.guess === wordList.head.value.translation) {
      wordList.head.value.correct_count++;
      wordList.head.value.memory_value =
        (wordList.head.value.memory_value * 2 >= wordList.listNodes().length
          ? wordList.listNodes().length - 1
          : wordList.head.value.memory_value * 2);
      wordList.total_score++;
      wordList.moveHeadBy(wordList.head.value.memory_value);
      LanguageService.persistLinkedList(req.app.get('db'), wordList).then(() => {
        res.json({
          nextWord: wordList.head.value.original,
          wordCorrectCount: wordList.head.value.correct_count,
          wordIncorrectCount: wordList.head.value.incorrect_count,
          totalScore: wordList.total_score,
          answer: req.body.guess,
          isCorrect: true,
        });
        next();
      });
    } 
    else {
      wordList.head.value.incorrect_count++;
      wordList.head.value.memory_value = 1;
      const rightAnswer = wordList.head.value.translation;
      wordList.moveHeadBy(wordList.head.value.memory_value);
      LanguageService.persistLinkedList(req.app.get('db'), wordList).then(() => {
        res.json({
          nextWord: wordList.head.value.original,
          wordCorrectCount: wordList.head.value.correct_count,
          wordIncorrectCount: wordList.head.value.incorrect_count,
          totalScore: wordList.total_score,
          answer: rightAnswer,
          isCorrect: false,
        });
        next();
      });
    }
  })

module.exports = languageRouter
