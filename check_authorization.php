<?php
// Telegram-provided data
$data = $_GET;

// Secret token (from @BotFather during bot creation)
$telegram_token = '7565825905:AAE0dSNKADQi9s9qtdsH3_k-BKGjx9khs7Q';

// Verify received data
function validateTelegramAuth($data, $telegram_token) {
    $check_hash = $data['hash'];
    unset($data['hash']);
    ksort($data);
    $data_check_string = '';
    foreach ($data as $key => $value) {
        $data_check_string .= "$key=$value\n";
    }
    $secret_key = hash('sha256', $telegram_token, true);
    $hash = hash_hmac('sha256', $data_check_string, $secret_key);

    return $hash === $check_hash;
}

if (validateTelegramAuth($data, $telegram_token)) {
    // Authentication successful, process user data
    // Example: store user info in session or database
    session_start();
    $_SESSION['user'] = [
        'id' => $data['id'],
        'first_name' => $data['first_name'],
        'last_name' => $data['last_name'],
        'username' => $data['username']
    ];

    echo 'Authentication successful!';
} else {
    echo 'Authentication failed!';
}

use Longman\TelegramBot\Request;
use Longman\TelegramBot\Entities\InlineKeyboard;
use Longman\TelegramBot\Entities\LoginUrl;

require 'vendor/autoload.php'; // Composer's autoloader

// Replace with your bot token and chat ID
$botToken = 'YOUR_TELEGRAM_BOT_TOKEN';
$receiverChatId = 'CHAT_ID';

// Set up Login URL
$loginUrl = new LoginUrl([
    'url' => 'https://mydomain.com/check_authorization.php',
    'request_write_access' => true,
]);

// Create Login Button
$loginKeyboard = new InlineKeyboard([
    ['login_url' => $loginUrl, 'text' => 'Click this button to login'],
]);

// Send Message with Login Button
$data = [
    'chat_id' => $receiverChatId,
    'reply_markup' => $loginKeyboard,
    'text' => 'Click the button below to login seamlessly via Telegram:',
];

$telegram = new Longman\TelegramBot\Telegram($botToken, 'YOUR_USERNAME');
Request::sendMessage($data);
?>

