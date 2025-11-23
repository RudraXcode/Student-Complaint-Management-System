import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { 
  GraduationCap, 
  Building2, 
  Award, 
  Globe, 
  Users, 
  MapPin,
  Info,
  BookOpen,
  Landmark,
  Trophy
} from 'lucide-react';
import { INDIAN_UNIVERSITIES } from '../utils/constants';

interface UniversityInfoProps {
  university: string;
}

export function UniversityInfo({ university }: UniversityInfoProps) {
  // Find university category
  const getUniversityCategory = (universityName: string) => {
    for (const [category, universities] of Object.entries(INDIAN_UNIVERSITIES)) {
      if (universities.includes(universityName as any)) {
        return category;
      }
    }
    return 'Other';
  };

  const category = getUniversityCategory(university);
  
  const getCategoryInfo = (cat: string) => {
    switch (cat) {
      case 'Central Universities':
        return {
          icon: <Landmark className="h-5 w-5 text-green-600" />,
          description: 'Established by the Central Government of India',
          features: ['Government Funded', 'Central Admission', 'Research Focus', 'National Recognition'],
          color: 'bg-green-50 border-green-200 text-green-800'
        };
      case 'IITs & IIMs':
        return {
          icon: <Trophy className="h-5 w-5 text-blue-600" />,
          description: 'Institutes of National Importance - Premier technical and management institutions',
          features: ['Elite Status', 'Global Recognition', 'Industry Leaders', 'Research Excellence'],
          color: 'bg-blue-50 border-blue-200 text-blue-800'
        };
      case 'NITs & IIITs':
        return {
          icon: <Award className="h-5 w-5 text-purple-600" />,
          description: 'National Institutes focusing on technical education and information technology',
          features: ['Technical Excellence', 'Government Funding', 'Industry Connect', 'Innovation Hub'],
          color: 'bg-purple-50 border-purple-200 text-purple-800'
        };
      case 'State Universities':
        return {
          icon: <Building2 className="h-5 w-5 text-purple-600" />,
          description: 'Established by State Governments with diverse academic programs',
          features: ['State Funded', 'Regional Focus', 'Diverse Programs', 'Cultural Heritage'],
          color: 'bg-purple-50 border-purple-200 text-purple-800'
        };
      case 'Deemed Universities':
        return {
          icon: <BookOpen className="h-5 w-5 text-orange-600" />,
          description: 'Granted deemed university status by UGC for excellence in specific areas',
          features: ['Specialized Focus', 'Autonomy', 'Research Oriented', 'Quality Education'],
          color: 'bg-orange-50 border-orange-200 text-orange-800'
        };
      case 'Private Universities':
        return {
          icon: <Globe className="h-5 w-5 text-red-600" />,
          description: 'Private institutions offering innovative and industry-aligned programs',
          features: ['Industry Focused', 'Modern Infrastructure', 'Innovation', 'Flexibility'],
          color: 'bg-red-50 border-red-200 text-red-800'
        };
      default:
        return {
          icon: <GraduationCap className="h-5 w-5 text-gray-600" />,
          description: 'Educational institution',
          features: ['Higher Education', 'Academic Programs'],
          color: 'bg-gray-50 border-gray-200 text-gray-800'
        };
    }
  };

  const categoryInfo = getCategoryInfo(category);
  const totalUniversities = Object.values(INDIAN_UNIVERSITIES).flat().length;

  return (
    <div className="flex items-center gap-2">
      <Badge className={`${categoryInfo.color} font-medium`}>
        {categoryInfo.icon}
        <span className="ml-1">{category}</span>
      </Badge>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Info className="h-3 w-3" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {categoryInfo.icon}
              University Information
            </DialogTitle>
            <DialogDescription>
              Information about {university} and Indian higher education system
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Current University Info */}
            <Card className={categoryInfo.color}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {university}
                </CardTitle>
                <CardDescription className="text-current opacity-80">
                  {categoryInfo.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {categoryInfo.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="border-current">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Indian Higher Education Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Indian Higher Education System
                </CardTitle>
                <CardDescription>
                  SCMS supports {totalUniversities}+ universities across India
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(INDIAN_UNIVERSITIES).map(([cat, unis]) => {
                    const catInfo = getCategoryInfo(cat);
                    return (
                      <div key={cat} className={`p-3 rounded-lg border ${catInfo.color}`}>
                        <div className="flex items-center gap-2 mb-1">
                          {catInfo.icon}
                          <span className="font-medium text-sm">{cat}</span>
                        </div>
                        <p className="text-xs opacity-80">{unis.length} institutions</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Detailed University Lists */}
            <Card>
              <CardHeader>
                <CardTitle>Browse All Universities</CardTitle>
                <CardDescription>
                  Explore all {totalUniversities}+ supported institutions by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={Object.keys(INDIAN_UNIVERSITIES)[0]} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto">
                    {Object.keys(INDIAN_UNIVERSITIES).map((cat) => (
                      <TabsTrigger 
                        key={cat} 
                        value={cat}
                        className="text-xs p-2 data-[state=active]:bg-[#2F5DCE] data-[state=active]:text-white"
                      >
                        {cat.split(' ')[0]}
                        <br />
                        <span className="text-xs opacity-75">
                          ({INDIAN_UNIVERSITIES[cat as keyof typeof INDIAN_UNIVERSITIES].length})
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {Object.entries(INDIAN_UNIVERSITIES).map(([cat, unis]) => (
                    <TabsContent key={cat} value={cat} className="mt-4">
                      <ScrollArea className="h-60 w-full rounded-md border p-4">
                        <div className="space-y-2">
                          {unis.map((uni, index) => (
                            <div 
                              key={uni}
                              className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 ${
                                uni === university ? 'bg-blue-50 border border-blue-200' : ''
                              }`}
                            >
                              <span className="text-sm text-gray-500 w-8">
                                {index + 1}.
                              </span>
                              <span className="text-sm flex-1">{uni}</span>
                              {uni === university && (
                                <Badge variant="outline" className="text-xs">
                                  Current
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {INDIAN_UNIVERSITIES['Central Universities'].length}
                  </div>
                  <div className="text-xs text-gray-600">Central Universities</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {INDIAN_UNIVERSITIES['IITs & IIMs'].length}
                  </div>
                  <div className="text-xs text-gray-600">IITs & IIMs</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {INDIAN_UNIVERSITIES['State Universities'].length}
                  </div>
                  <div className="text-xs text-gray-600">State Universities</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {INDIAN_UNIVERSITIES['Private Universities'].length}
                  </div>
                  <div className="text-xs text-gray-600">Private Universities</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}