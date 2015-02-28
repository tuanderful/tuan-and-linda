<?php
//uncomment for error reporting
//error_reporting(E_ALL);
//ini_set('display_errors', 1);

/**
 * Twitter Configuration - required
 */

$get_usernames = array(
	'twitter_one' => 'themeforest',
	'twitter_two' => 'codecanyon',
);

$twitter_username = (isset($_GET['get']) && isset($get_usernames[$_GET['get']])) ? $get_usernames[$_GET['get']] : '';

$config = array(

	'username' => $twitter_username, // from which twitter account to fetch tweets
	'count' => '3', // number of tweets to fetch
	'cache' => '3600', // cache calls to twitter api in seconds, use false to disable cache
	'api_key' => 'JICPw59T0dTKwvHl6JfVw', // Consumer Key (API Key)
	'api_secret' => 'Ls9ENSlVXb0Wv2vmD6Il2RYM7zGSrFa6QxOEugzEKLg', // Consumer Secret (API Secret)
	'access_token' => '607263804-3IWH4UinHTKwTwoAZPwKvZtO9EPLTHiR0yW3USg', // Account Access Token
	'access_token_secret' => 'mbpDsqtuvpFtDQODQVBiL8h33PeC1RnJvqiaNrGRz5Q' // Account Access Token Secret

);

// time ago function
function time_elapsed_string($ptime) {
	$etime = time() - $ptime;
	if ($etime < 1)
	{
		return '0 seconds';
	}
	$a = array( 12 * 30 * 24 * 60 * 60  =>  'year',
				30 * 24 * 60 * 60       =>  'month',
				24 * 60 * 60            =>  'day',
				60 * 60                 =>  'hour',
				60                      =>  'minute',
				1                       =>  'second'
				);
	foreach ($a as $secs => $str)
	{
		$d = $etime / $secs;
		if ($d >= 1)
		{
			$r = round($d);
			return $r . ' ' . $str . ($r > 1 ? 's' : '');
		}
	}
}


//extract variables and check config
extract($config);

if(!$username || !$count || !$api_key || !$api_secret || !$access_token || !$access_token_secret) {
	return;
}

//check for cache file
$cached_output = false;
if($cache !== false && $cache) {
	if(!file_exists('./twitter.cache')) {
		file_put_contents('./twitter.cache', '');
	} else {
		$cached = file_get_contents('./twitter.cache');
		@$unserialized = unserialize($cached);
		
		if($unserialized !== false) {
			if(isset($unserialized[$twitter_username])) {
				$unserialized = $unserialized[$twitter_username];
				
				if(isset($unserialized['time']) && $unserialized['time'] && isset($unserialized['data']) && $unserialized['data']) {
					
					if( (time() - $unserialized['time']) < $cache) {
						$cached_output = $unserialized['data'];
					}
					
				}
			}
		}
	}
}

if(!$cached_output) {

	/**
	 * Load necessary libraries, must be in the same directory
	 */
	// Library for signing requests, OAuth v1
	include "./OAuth.php";
	// Twitter Autolink Class
	include "./Autolink.php";
	
	
	//sign request and call twitter api
	$method = "GET";
	$url = "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=".$username."&count=".$count."&trim_user=1";
		
	$signature_method = New OAuthSignatureMethod_HMAC_SHA1();
	$consumer = New OAuthConsumer($api_key , $api_secret);        
	$token = New OAuthConsumer($access_token , $access_token_secret);        
	$request = OAuthRequest::from_consumer_and_token($consumer, $token, $method, $url);            
	$request->sign_request($signature_method, $consumer, $token);

	$curl = curl_init();
	curl_setopt($curl, CURLOPT_HEADER, FALSE);
	curl_setopt($curl, CURLOPT_TIMEOUT, 20);
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
	curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type' => 'application/x-www-form-urlencoded'));
	curl_setopt($curl, CURLOPT_USERAGENT, 'PHP');
	curl_setopt($curl, CURLOPT_URL, $request->to_url());
	$result = curl_exec($curl);
	curl_close($curl);

	$tweets = json_decode($result);

	if(!$tweets || isset($tweets->errors)) {
		return;
	}
	
	// output result in json format & cache it
	$output = array();
	foreach ($tweets as $tweet) {
		
		$tweet_text = htmlentities(htmlspecialchars_decode($tweet->text), ENT_COMPAT, 'UTF-8');
		
		$output[] = array(
			'time_ago' => time_elapsed_string(strtotime($tweet->created_at)),
			'text' => Twitter_Autolink::create($tweet_text)->setNoFollow(false)->addLinks(),
			'actions' => array(
				'reply' => 'http://twitter.com/intent/retweet?tweet_id='. $tweet->id_str,
				'retweet' => 'http://twitter.com/intent/tweet?in_reply_to='. $tweet->id_str,
				'favorite' => 'http://twitter.com/intent/favorite?tweet_id='. $tweet->id_str,
			)
		);
	}

	//cache result
	if($cache !== false && $cache && file_exists('./twitter.cache')) {
		$file = './twitter.cache';
		
		$cached = file_get_contents($file);
		@$unserialized = unserialize($cached);
		
		if(!$unserialized) {
			$unserialized = array();
		}
		
		$contents = serialize(array_merge(array( $username => array(
			'time' => time(),
			'data' => $output
		)), $unserialized));
		
		file_put_contents($file, $contents);
	}
} else {
	 $output = $cached_output;
}

echo json_encode($output);

?>