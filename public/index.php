<?php
// Front controller using Twig (if installed via Composer).

// Allow direct access to static files
$requestPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (preg_match('/\.(css|js|ico|png|jpg|jpeg|gif)$/', $requestPath)) {
    $filePath = __DIR__ . $requestPath;
    if (file_exists($filePath)) {
        $ext = pathinfo($filePath, PATHINFO_EXTENSION);
        $contentTypes = [
            'css' => 'text/css',
            'js' => 'application/javascript',
            'ico' => 'image/x-icon',
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif'
        ];
        if (isset($contentTypes[$ext])) {
            header('Content-Type: ' . $contentTypes[$ext]);
            readfile($filePath);
            exit;
        }
    }
}

$vendor = __DIR__ . '/../vendor/autoload.php';
$path = $requestPath;

// Normalize and remove trailing slashes
if ($path !== '/' ) {
	$path = rtrim($path, '/');
}

if (!file_exists($vendor)) {
	// Composer not installed — use a PHP fallback renderer that includes static fallback pages
	$base = __DIR__ . '/fallback';
	switch ($path) {
		case '':
		case '/':
		case '/index.php':
			include $base . '/landing.php';
			break;
		case '/auth/login':
		case '/auth/login.php':
			include $base . '/auth_login.php';
			break;
		case '/auth/signup':
		case '/auth/signup.php':
			include $base . '/auth_signup.php';
			break;
		case '/dashboard':
		case '/dashboard.php':
			include $base . '/dashboard.php';
			break;
		case '/tickets':
		case '/tickets.php':
			include $base . '/tickets.php';
			break;
		default:
			http_response_code(404);
			echo "<h2>404 - Not Found</h2>";
			break;
	}
	exit;
}

require_once $vendor;

$loader = new \Twig\Loader\FilesystemLoader(__DIR__ . '/../templates');
$twig = new \Twig\Environment($loader, [
	'cache' => false,
	'debug' => true,
]);

// Map request path to template
switch ($path) {
	case '':
	case '/':
	case '/index.php':
		$template = 'landing.twig';
		break;
	case '/auth/login':
	case '/auth/login.php':
		$template = 'auth_login.twig';
		break;
	case '/auth/signup':
	case '/auth/signup.php':
		$template = 'auth_signup.twig';
		break;
	case '/dashboard':
	case '/dashboard.php':
		$template = 'dashboard.twig';
		break;
	case '/tickets':
	case '/tickets.php':
		$template = 'tickets.twig';
		break;
	default:
		http_response_code(404);
		echo $twig->render('layout.twig', ['content' => '<h2>404 - Not Found</h2>']);
		exit;
}

// Render the chosen template. Pass a small 'auth' flag (templates may use it).
echo $twig->render($template, ['auth' => true]);

?>