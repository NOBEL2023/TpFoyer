# Foyer Management Frontend

This is an Angular frontend application for the Foyer Management System. It provides a modern, responsive interface for managing blocs, chambres, and étudiants.

## Features

- **Bloc Management**: Create, read, update, and delete blocs
- **Chambre Management**: Manage rooms with different types (SIMPLE, DOUBLE, TRIPLE)
- **Étudiant Management**: Student management with personal information
- **Responsive Design**: Works on desktop and mobile devices
- **Material Design**: Uses Angular Material for a modern UI
- **Form Validation**: Client-side validation for all forms
- **Error Handling**: User-friendly error messages and notifications

## Technologies Used

- Angular 17
- Angular Material
- Bootstrap 5
- TypeScript
- RxJS
- Jasmine/Karma for testing

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Navigate to the angular-frontend directory:
   ```bash
   cd angular-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:4200`

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Running Tests

```bash
npm test
```

This will run the unit tests using Karma and Jasmine.

### Running End-to-End Tests

```bash
npm run e2e
```

## Project Structure

```
src/
├── app/
│   ├── components/          # Angular components
│   │   ├── bloc/           # Bloc-related components
│   │   ├── chambre/        # Chambre-related components
│   │   ├── etudiant/       # Étudiant-related components
│   │   └── navbar/         # Navigation component
│   ├── models/             # TypeScript interfaces
│   ├── services/           # Angular services for API calls
│   ├── app.component.*     # Root component
│   └── app.routes.ts       # Application routing
├── assets/                 # Static assets
├── styles.scss            # Global styles
└── index.html             # Main HTML file
```

## API Integration

The frontend communicates with the Spring Boot backend API running on `http://localhost:8089/tpfoyer`. Make sure the backend server is running before using the frontend.

## Testing

The application includes comprehensive unit tests for:
- Components
- Services
- Forms validation
- API integration

Run tests with:
```bash
npm test
```

For test coverage:
```bash
npm run test -- --code-coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.