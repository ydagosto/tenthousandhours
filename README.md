# tenthousandhours

## Overview

TenThousandHours is a web application designed to help users track their progress toward mastering various skills. The app is inspired by the “10,000-hour rule,” which suggests that it takes approximately 10,000 hours of practice to achieve mastery in any field. Users can log their practice hours for different activities, monitor their progress, and visualize their journey toward mastery. 

This project is a portfolio piece, showcasing full-stack development skills using modern web technologies.

## Features

  - User Registration and Authentication: Users can create an account, log in, and securely manage their profiles.
  - Activity Management: Users can create, update, and delete activities they wish to track.
  - Practice Logging: Users can log their practice sessions, including the date and duration.
  - Progress Visualization: The app provides visual tools, including contribution charts and bar charts, to help users track their cumulative progress over time.
  - Responsive Design: The application is fully responsive and accessible on all device sizes.

## Technical Architecture

### Frontend
  - Framework: The frontend is built using Next.js for server-side rendering and React components, providing a fast and dynamic user experience.
  - Styling: The application utilizes Tailwind CSS for styling, offering a utility-first approach that simplifies the design process.
  - Charts and Visualization:
  - react-chartjs-2 is used for rendering bar charts, allowing users to see daily practice hours and cumulative progress.
  - react-activity-calendar is used to create contribution charts similar to those found on GitHub, offering a clear view of daily practice over a year.
  - Component Library: Material-UI (MUI) is used for UI components, ensuring a consistent and accessible user interface.

### Backend
  - API Layer: The backend API is implemented using Go (Golang), known for its performance, simplicity, and concurrency capabilities. The API provides RESTful endpoints for managing user accounts, activities, and practice logs.
  - Database: The app uses PostgreSQL as the primary data store, leveraging its robust features for relational data management.
  - Authentication: User authentication is managed using JWT (JSON Web Tokens), ensuring secure and stateless sessions.

### Deployment and Infrastructure
  - Containerization: The application is containerized using Docker. This ensures consistency across development, testing, and production environments.
  - Kubernetes:
  - Kubernetes is used to orchestrate the deployment of the application’s containers, ensuring scalability, high availability, and easy management of microservices.
  - The application is deployed as a set of Kubernetes pods, with separate services for the frontend, backend, and database components.
  - PersistentVolumeClaim (PVC) is used to manage persistent storage for the PostgreSQL database, ensuring data durability.
  - Azure Kubernetes Service (AKS):
  - The application is deployed on Azure Kubernetes Service (AKS), providing a fully managed Kubernetes cluster in the cloud.
  - AKS handles the scaling of pods and services automatically based on traffic and resource usage.
  - Azure Container Registry (ACR) is used to store Docker images securely, which are then pulled by the AKS cluster for deployment.
  - Azure Services:
  - Azure Storage is used for any static assets or backups, ensuring they are stored securely and are accessible globally.
  - Azure Monitor is utilized for logging and monitoring the application’s performance and health, providing insights into the application’s operations in real-time.

### Continuous Deployment
  - GitHub Actions:
  - A CI/CD pipeline is set up using GitHub Actions to automate the build, test, and deployment processes.
  - The pipeline includes steps to:
  - Build the Docker images for both the frontend and backend.
  - Push the images to Azure Container Registry (ACR).
  - Deploy the updated images to the AKS cluster.
  - This ensures that every change pushed to the main branch is automatically tested and deployed, maintaining continuous delivery.

### Data Flow

  1. User Interaction: Users interact with the frontend, logging in, managing activities, and logging practice sessions.
  2. API Requests: The frontend communicates with the Go-based backend via API requests to fetch, create, update, and delete data.
  3. Data Storage: Data is persisted in PostgreSQL, with activity and practice log data being stored and queried as needed.
  4. Data Visualization: The frontend retrieves the data and renders it in charts and tables, providing users with insights into their progress.

### Key Components

  - Next.js Pages: The app uses Next.js pages for routing, ensuring seamless navigation across different sections of the app.
  - Custom Components: Reusable components such as ActivitySidebar, AddPracticeButton, BarChart, and ContributionChart are built using React and TypeScript, adhering to best practices in component-based architecture.
  - Kubernetes Manifests: The deployment, service, and PVC configurations are managed using Kubernetes manifests, which define how the application is deployed and scaled in the AKS cluster.
  - GitHub Actions: The CI/CD pipeline is defined in .github/workflows/deploy.yml, handling the automation of builds, tests, and deployments.
