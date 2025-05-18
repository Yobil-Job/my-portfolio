
"use client";

import { EndpointDetail, EndpointData } from '@/components/api-explorer/EndpointDetail';
import { developerInfo } from '@/data/developer';
import { projectsData } from '@/data/projects';
import { Balancer } from 'react-wrap-balancer';

const apiEndpoints: EndpointData[] = [
  {
    method: 'GET',
    path: '/about',
    description: 'Retrieves information about the developer.',
    requestSample: null,
    responseSample: developerInfo,
  },
  {
    method: 'GET',
    path: '/skills',
    description: 'Lists the developer\'s skills and technology stack.',
    requestSample: null,
    responseSample: developerInfo.skills,
  },
  {
    method: 'GET',
    path: '/projects',
    description: 'Fetches a list of projects.',
    parameters: [
      { name: 'limit', type: 'integer', in: 'query', description: 'Maximum number of projects to return.', required: false },
      { name: 'status', type: 'string', in: 'query', description: 'Filter projects by status (e.g., completed, in-progress).', required: false, enum: ['completed', 'in-progress', 'coming-soon']},
    ],
    requestSample: null,
    responseSample: projectsData.slice(0, 2), // Sample response with first 2 projects
  },
  {
    method: 'POST',
    path: '/contact',
    description: 'This mock endpoint demonstrates submitting a contact message. The request sample shows example placeholder values; replace them with actual data if you were building a client to call such an API. The *actual, functional contact form* that sends messages to the developer is available on the main dashboard.',
    requestBody: {
      contentType: 'application/json',
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Jane Doe' },
          email: { type: 'string', example: 'jane.doe@example.com' },
          message: { type: 'string', example: 'Hello, I would like to connect!' },
        },
        required: ['name', 'email', 'message'],
      },
    },
    requestSample: {
      name: 'Your Name',
      email: 'your.email@example.com', // Generic placeholder
      message: 'Your message to the developer.', // Generic placeholder
    },
    responseSample: {
      success: true,
      message: 'Message sent successfully (mock response).',
    },
  },
];

export default function ApiExplorerPage() {
  return (
    <div className="space-y-10">
      <header className="text-center space-y-2 py-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          <Balancer>API Explorer</Balancer>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          <Balancer>
            Explore the mock API endpoints that represent the data structure of this portfolio.
            These demonstrate how data might be fetched and interacted with programmatically.
            The actual functional contact form is on the dashboard.
          </Balancer>
        </p>
      </header>

      <div className="space-y-8">
        {apiEndpoints.map((endpoint) => (
          <EndpointDetail key={`${endpoint.method}-${endpoint.path}`} endpoint={endpoint} />
        ))}
      </div>
    </div>
  );
}
