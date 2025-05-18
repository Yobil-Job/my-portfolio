"use client";

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Balancer } from 'react-wrap-balancer';

type Parameter = {
  name: string;
  in: 'path' | 'query' | 'header' | 'cookie';
  description: string;
  required: boolean;
  type: string;
  example?: string | number | boolean;
  enum?: string[];
};

type RequestBody = {
  contentType: string;
  schema: {
    type: string;
    properties: Record<string, { type: string; example?: any }>;
    required?: string[];
  };
};

export interface EndpointData {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  requestSample: any | null;
  responseSample: any;
}

interface EndpointDetailProps {
  endpoint: EndpointData;
}

const getMethodColor = (method: EndpointData['method']) => {
  switch (method) {
    case 'GET': return 'bg-sky-600 hover:bg-sky-700';
    case 'POST': return 'bg-green-600 hover:bg-green-700';
    case 'PUT': return 'bg-amber-600 hover:bg-amber-700';
    case 'DELETE': return 'bg-red-600 hover:bg-red-700';
    case 'PATCH': return 'bg-purple-600 hover:bg-purple-700';
    default: return 'bg-gray-600 hover:bg-gray-700';
  }
};

export function EndpointDetail({ endpoint }: EndpointDetailProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${type} Copied!`,
      description: `${type} has been copied to your clipboard.`,
    });
  };

  return (
    <Card className="overflow-hidden shadow-lg rounded-xl">
      <CardHeader 
        className="flex flex-row items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <Badge className={`px-3 py-1.5 text-xs font-semibold text-white rounded-md ${getMethodColor(endpoint.method)}`}>
            {endpoint.method}
          </Badge>
          <span className="text-sm font-mono font-medium text-foreground">{endpoint.path}</span>
        </div>
        <div className="flex items-center">
          <p className="text-sm text-muted-foreground mr-4 hidden md:block truncate max-w-xs">
            <Balancer>{endpoint.description}</Balancer>
          </p>
          {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-6 border-t space-y-6">
          <p className="text-sm text-muted-foreground md:hidden">{endpoint.description}</p>

          {endpoint.parameters && endpoint.parameters.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Parameters:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
                {endpoint.parameters.map(param => (
                  <li key={param.name}>
                    <code className="bg-muted px-1 rounded-sm text-foreground">{param.name}</code> ({param.type}, {param.in}): {param.description} {param.required && <Badge variant="outline" className="ml-1 text-xs">Required</Badge>}
                    {param.enum && <span className="text-xs"> (Enum: {param.enum.join(', ')})</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {endpoint.requestBody && (
             <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Request Body ({endpoint.requestBody.contentType}):</h4>
               <pre className="bg-muted p-3 rounded-md text-xs text-foreground custom-scrollbar overflow-auto max-h-60 relative group">
                 <code>{JSON.stringify(endpoint.requestBody.schema, null, 2)}</code>
                 <Button 
                    variant="ghost" size="icon" 
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => copyToClipboard(JSON.stringify(endpoint.requestBody.schema, null, 2), 'Request Body Schema')}
                  >
                   <Copy className="h-3.5 w-3.5"/>
                 </Button>
               </pre>
             </div>
          )}

          {endpoint.requestSample && (
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Sample Request:</h4>
              <pre className="bg-muted p-3 rounded-md text-xs text-foreground custom-scrollbar overflow-auto max-h-60 relative group">
                <code>{JSON.stringify(endpoint.requestSample, null, 2)}</code>
                <Button 
                    variant="ghost" size="icon" 
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => copyToClipboard(JSON.stringify(endpoint.requestSample, null, 2), 'Sample Request')}
                  >
                   <Copy className="h-3.5 w-3.5"/>
                 </Button>
              </pre>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Sample Response (200 OK):</h4>
            <pre className="bg-muted p-3 rounded-md text-xs text-foreground custom-scrollbar overflow-auto max-h-60 relative group">
              <code>{JSON.stringify(endpoint.responseSample, null, 2)}</code>
              <Button 
                variant="ghost" size="icon" 
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyToClipboard(JSON.stringify(endpoint.responseSample, null, 2), 'Sample Response')}
                >
                <Copy className="h-3.5 w-3.5"/>
              </Button>
            </pre>
          </div>
          
          {/* Optional: "Try It Out" button - Placeholder */}
          {/* <Button variant="default" size="sm" disabled>
            Try It Out (Coming Soon)
          </Button> */}
        </CardContent>
      )}
    </Card>
  );
}
