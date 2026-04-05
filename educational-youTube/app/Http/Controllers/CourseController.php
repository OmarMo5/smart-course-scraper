<?php

namespace App\Http\Controllers;

use App\Models\Playlist;
use App\Services\AIService;
use App\Services\YouTubeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CourseController extends Controller
{
    protected $aiService;
    protected $youtubeService;
    
    public function __construct(AIService $aiService, YouTubeService $youtubeService)
    {
        $this->aiService = $aiService;
        $this->youtubeService = $youtubeService;
    }
    
    public function fetchCourses(Request $request)
    {
        // التحقق من صحة البيانات
        $request->validate([
            'categories' => 'required|array',
            'categories.*' => 'string|min:1'
        ]);
        
        $results = [];
        
        foreach ($request->categories as $category) {
            try {
                // Step 1: Generate course titles using AI
                $titles = $this->aiService->generateCourseTitles($category);
                
                // Step 2: Search YouTube for each title
                $allPlaylists = [];
                foreach ($titles as $title) {
                    $playlists = $this->youtubeService->searchPlaylists($title);
                    if (!empty($playlists)) {
                        $allPlaylists = array_merge($allPlaylists, $playlists);
                    }
                }
                
                // Step 3: Store playlists with deduplication
                $storedPlaylists = $this->storePlaylists($allPlaylists, $category);
                
                $results[$category] = [
                    'success' => true,
                    'titles_generated' => count($titles),
                    'playlists_found' => count($allPlaylists),
                    'playlists_stored' => count($storedPlaylists),
                    'playlists' => $storedPlaylists
                ];
                
            } catch (\Exception $e) {
                Log::error("Error processing category {$category}: " . $e->getMessage());
                $results[$category] = [
                    'success' => false,
                    'error' => 'Failed to process category',
                    'message' => $e->getMessage()
                ];
            }
        }
        
        return response()->json([
            'success' => true,
            'data' => $results
        ]);
    }
    
    private function storePlaylists($playlists, $category)
    {
        $stored = [];
        
        foreach ($playlists as $playlist) {
            // التأكد من وجود playlist_id
            if (!isset($playlist['playlist_id'])) {
                continue;
            }
            
            // Deduplication logic - check if playlist already exists
            $existing = Playlist::where('playlist_id', $playlist['playlist_id'])->first();
            
            if (!$existing) {
                $newPlaylist = Playlist::create([
                    'playlist_id' => $playlist['playlist_id'],
                    'title' => $playlist['title'] ?? 'Untitled',
                    'description' => isset($playlist['description']) ? substr($playlist['description'], 0, 500) : '',
                    'thumbnail' => $playlist['thumbnail'] ?? '',
                    'channel_name' => $playlist['channel_name'] ?? 'Unknown',
                    'category' => $category
                ]);
                
                $stored[] = $newPlaylist;
            } else {
                $stored[] = $existing;
            }
        }
        
        return $stored;
    }
    
    public function getPlaylists(Request $request)
    {
        $query = Playlist::query();
        
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }
        
        $playlists = $query->orderBy('created_at', 'desc')->paginate(20);
        
        return response()->json([
            'success' => true,
            'data' => $playlists
        ]);
    }
    
    public function getCategories()
    {
        $categories = Playlist::select('category')
            ->distinct()
            ->orderBy('category')
            ->get()
            ->pluck('category');
            
        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }
}