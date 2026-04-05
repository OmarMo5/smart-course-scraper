<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class YouTubeService
{
    protected $apiKey;
    
    public function __construct()
    {
        $this->apiKey = env('YOUTUBE_API_KEY');
    }
    
    public function searchPlaylists($query, $maxResults = 2)
    {
        // إذا لم يوجد مفتاح API، أرجع بيانات تجريبية
        if (!$this->apiKey || $this->apiKey === 'your_youtube_api_key_here') {
            return $this->getFallbackPlaylists($query);
        }
        
        try {
            $response = Http::get('https://www.googleapis.com/youtube/v3/search', [
                'part' => 'snippet',
                'type' => 'playlist',
                'q' => $query . ' course tutorial',
                'maxResults' => $maxResults,
                'key' => $this->apiKey
            ]);
            
            if ($response->successful()) {
                $items = $response->json()['items'] ?? [];
                $playlists = [];
                
                foreach ($items as $item) {
                    $playlists[] = [
                        'playlist_id' => $item['id']['playlistId'],
                        'title' => $item['snippet']['title'],
                        'description' => $item['snippet']['description'] ?? '',
                        'thumbnail' => $item['snippet']['thumbnails']['high']['url'] ?? '',
                        'channel_name' => $item['snippet']['channelTitle']
                    ];
                }
                
                return $playlists;
            }
            
            return $this->getFallbackPlaylists($query);
            
        } catch (\Exception $e) {
            Log::error('YouTube API Error: ' . $e->getMessage());
            return $this->getFallbackPlaylists($query);
        }
    }
    
    private function getFallbackPlaylists($query)
    {
        // بيانات تجريبية للتجربة
        return [
            [
                'playlist_id' => 'PL' . rand(100000, 999999),
                'title' => $query . ' - Complete Course 2024',
                'description' => 'Learn ' . $query . ' from scratch with this comprehensive tutorial',
                'thumbnail' => 'https://img.youtube.com/vi/default/mqdefault.jpg',
                'channel_name' => 'EduChannel'
            ],
            [
                'playlist_id' => 'PL' . rand(100000, 999999),
                'title' => $query . ' Tutorial for Beginners',
                'description' => 'Step by step guide to mastering ' . $query,
                'thumbnail' => 'https://img.youtube.com/vi/default/mqdefault.jpg',
                'channel_name' => 'LearnHub'
            ]
        ];
    }
}