# Cinelist - Final Project

A movie watchlist app built for my final project assignment.

## Overview

This is a Letterboxd.com style app where users can search for movies and add them to their personal watchlist. Built using the TMDb API for real movie data including posters, ratings, and descriptions.

## Why This Project?

I chose to build a movie watchlist app because I'm passionate about movies and shows. I love logging what I've watched and rating films on IMDb and Letterboxd, so creating my own version felt like a natural choice for my final project. While this version is missing many features that a complete movie tracking site would need (like detailed reviews, social features, or advanced filtering), I focused on getting the core functionality working properly like user authentication, movie search, and watchlist management. The goal was to build something that actually works well rather than trying to implement every possible feature. 

## Features

- Movie search with TMDb API integration
- Add/remove movies from watchlist (localStorage)
- Firebase Authentication (register/login/logout)
- Filter movies by genre and year
- Movie detail modal with overview
- Toast notifications instead of alerts
- Responsive design
- Environment variables for API security

## Code Reuse from Previous Assignments

To save development time, I reused several patterns and techniques from my earlier assignments:

**From Assignment 1 (Star Wars):**
- API fetch patterns and error handling
- Grid layout for movie cards
- Modal implementation for movie details
- Responsive CSS design patterns

**From Assignment 2 (Medicine Tracker):**
- Form validation techniques
- localStorage implementation
- Error message display patterns
- Object oriented approach for data management

**From Assignment 3 (React Expense Tracker):**
- React functional components structure
- useState and useEffect hooks
- Form handling and validation patterns
- Component props and data flow

## Live Demo & Repository

**Live Website:** https://cinelist-d993f.web.app  
**GitHub Repository:** https://github.com/BaranYF/8 (contains all assignments)

## Technical Implementation

- React with functional components and hooks
- Create React App for development and bundling
- Firebase Authentication for user management
- Firebase Hosting for deployment
- TMDb API with environment variables for security
- localStorage for watchlist persistence
- CSS Grid and Flexbox for layout
- Form validation with proper error handling
- Component based architecture

## Future Improvements

- Movie recommendations based on watchlist
- Better search with autocomplete
- Multiple watchlist categories  
- Social sharing features
- Movie trailers integration
- User reviews and ratings

This project demonstrates the progression from my earlier assignments, combining API integration, form handling, and responsive design into a more complex React application with proper component architecture and state management.