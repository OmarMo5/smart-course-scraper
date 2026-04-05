<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIService
{
    protected $apiKey;
    
    public function __construct()
    {
        $this->apiKey = env('OPENAI_API_KEY');
    }
    
    public function generateCourseTitles($category, $count = 15)
    {
        // إذا لم يوجد مفتاح API، استخدم العناوين الافتراضية
        if (!$this->apiKey || $this->apiKey === 'your_openai_api_key_here') {
            return $this->getFallbackTitles($category);
        }
        
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(30)->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are a course title generator. Generate unique, engaging course titles. Return only the titles as a JSON array.'
                    ],
                    [
                        'role' => 'user',
                        'content' => "Generate {$count} course titles about '{$category}'. Return format: [\"Title 1\", \"Title 2\", ...]"
                    ]
                ],
                'temperature' => 0.8,
                'max_tokens' => 500
            ]);
            
            if ($response->successful()) {
                $content = $response->json()['choices'][0]['message']['content'];
                // Extract JSON array from response
                if (preg_match('/\[(.*)\]/s', $content, $matches)) {
                    $titles = json_decode($matches[0], true);
                    if (is_array($titles) && count($titles) > 0) {
                        return $titles;
                    }
                }
            }
            
            return $this->getFallbackTitles($category);
            
        } catch (\Exception $e) {
            Log::error('AI Service Error: ' . $e->getMessage());
            return $this->getFallbackTitles($category);
        }
    }
    
    private function getFallbackTitles($category)
    {
        return [
            "Complete {$category} Masterclass 2024",
            "{$category} for Beginners to Advanced",
            "Professional {$category} Certification",
            "Real-World {$category} Projects",
            "{$category} Essentials Bootcamp",
            "Advanced {$category} Techniques",
            "{$category} from Zero to Hero",
            "Practical {$category} Applications",
            "{$category} Best Practices",
            "Mastering {$category} in 30 Days",
            "{$category} Fundamentals",
            "The Ultimate {$category} Course",
            "{$category} Crash Course",
            "Learn {$category} Fast",
            "{$category} Pro: Advanced Strategies"
        ];
    }
}