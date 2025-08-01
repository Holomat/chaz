<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Homi Cultura - Agenda Cultural de Uruguay</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            background: #1a1a1a;
            color: #ffffff;
            line-height: 1.4;
            overflow-x: hidden;
        }
        
        /* ===== HEADER CON NAVEGACIÓN ===== */
        .main-header {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: transparent;
            border-bottom: none;
            padding: 12px 0;
        }
        
        .header-content {
            max-width: none;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0 20px;
        }
        
        .nav-tabs {
            display: flex;
            gap: 0;
            background: rgba(45, 45, 45, 0.7);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 6px;
            width: calc(100vw - 40px);
            position: relative;
            margin: 0 auto;
        }
        
        .nav-slider {
            display: none;
        }
        
        /* Reset completo para botones nativos */
        button {
            all: unset;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
        }
        
        .nav-tab {
            flex: 1;
            padding: 8px 16px;
            font-size: 10px;
            font-weight: 500;
            color: #6b7280;
            background: transparent !important;
            border: none !important;
            cursor: pointer;
            transition: color 0.2s ease;
            white-space: nowrap;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            position: relative;
            z-index: 1;
            outline: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            appearance: none !important;
        }
        
        .nav-tab:focus {
            outline: none !important;
            box-shadow: none !important;
            background: transparent !important;
            border: none !important;
        }
        
        .nav-tab:active {
            background: transparent !important;
            box-shadow: none !important;
            outline: none !important;
        }
        
        .nav-tab.active {
            color: #ffffff;
            background: transparent !important;
            box-shadow: none !important;
            outline: none !important;
        }
        
        .nav-tab:hover:not(.active) {
            color: #9ca3af;
        }
        
        .nav-tab svg {
            width: 20px;
            height: 20px;
            stroke: currentColor;
        }
        
        /* ===== CONTENIDO PRINCIPAL ===== */
        .main-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            min-height: calc(100vh - 140px);
        }
        
        /* ===== VISTA INICIO ===== */
        .home-view {
            display: block;
        }
        
        .home-hero {
            text-align: center;
            margin-bottom: 40px;
            padding: 40px 20px;
        }
        
        .hero-title {
            font-size: 32px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 12px;
        }
        
        .hero-subtitle {
            font-size: 16px;
            color: #9ca3af;
            max-width: 480px;
            margin: 0 auto;
        }
        
        /* ===== CARRUSELES TEMÁTICOS (AHORA VERTICAL PARA RAMPA) ===== */
        .carousel-section {
            margin-bottom: 40px;
            width: 100vw;
            margin-left: calc(-50vw + 50%);
            position: relative;
        }
        
        .carousel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding: 0 20px;
            max-width: none;
            margin-left: 0;
            margin-right: 0;
        }
        
        .carousel-title {
            font-size: 20px;
            font-weight: 600;
            color: #ffffff;
        }
        
        .see-all-link {
            color: #007aff;
            font-size: 14px;
            font-weight: 500;
            text-decoration: none;
            cursor: pointer;
            transition: color 0.2s ease;
        }
        
        .see-all-link:hover {
            color: #0056cc;
        }
        
        .carousel-container {
            position: relative;
            overflow: hidden;
            width: 100%;
        }
        
        .carousel-track {
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding: 4px 20px 4px 20px;
            margin: 0;
            width: 100%;
        }
        
        .carousel-track::-webkit-scrollbar {
            display: none;
        }
        
        /* ===== TARJETAS DE EVENTOS (NUEVO DISEÑO LIQUID GLASS) ===== */
        .event-card {
            flex: 0 0 calc(100vw - 24px);
            background: transparent;
            border-radius: 20px;
            overflow: hidden;
            transition: all 0.2s ease;
            cursor: pointer;
            position: relative;
            height: auto;
            margin: 0;
        }
        
        .event-card:active {
            transform: scale(0.9);
        }
        
        .event-image {
            width: 100%;
            height: 420px;
            background: #e0e0e0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            position: relative;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            border-radius: 20px 20px 0 0;
            margin: 0;
        }
        
        .event-image.has-poster {
            background-image: none;
        }
        
        .event-poster {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 20px 20px 0 0;
        }
        
        .poster-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: transparent;
            pointer-events: none;
            border-radius: 20px 20px 0 0;
        }
        
        .event-date-badge {
            display: none;
        }
        
        .event-category {
            display: none;
        }
        
        .category-musica { background: rgba(255, 107, 107, 0.9); color: white; }
        .category-teatro { background: rgba(138, 43, 226, 0.9); color: white; }
        .category-arte { background: rgba(255, 193, 7, 0.9); color: #333; }
        .category-danza { background: rgba(233, 30, 99, 0.9); color: white; }
        .category-festival { background: rgba(76, 175, 80, 0.9); color: white; }
        .category-cine { background: rgba(33, 150, 243, 0.9); color: white; }
        .category-feria { background: rgba(158, 158, 158, 0.9); color: white; }
        .category-coffee-rave { background: rgba(101, 67, 33, 0.9); color: white; }
        .category-indie-rock { background: rgba(255, 152, 0, 0.9); color: white; }
        .category-pubs-bares { background: rgba(121, 85, 72, 0.9); color: white; }
        .category-electronica { background: rgba(156, 39, 176, 0.9); color: white; }
        .category-libros { background: rgba(63, 81, 181, 0.9); color: white; }
        .category-urbano { background: rgba(244, 67, 54, 0.9); color: white; }
        .category-cumbia { background: rgba(255, 235, 59, 0.9); color: #333; }
        .category-planes-familiares { background: rgba(139, 195, 74, 0.9); color: white; }
        .category-aire-libre { background: rgba(76, 175, 80, 0.9); color: white; }
        .category-main { background: rgba(96, 125, 139, 0.9); color: white; }
        
        .favorite-btn {
            display: none;
        }
        
        .event-content {
            padding: 20px;
            margin-top: 0;
            height: auto;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background: rgba(232, 61, 185, 0.9);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 0 0 20px 20px;
            min-height: 100px;
        }
        
        .event-title {
            font-family: 'Inter', sans-serif;
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 8px;
            color: #000000;
            line-height: 118%;
            text-align: left;
            text-transform: none;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        .event-title .event-details {
            font-weight: 400;
            color: #333333;
            font-size: 14px;
        }
        
        .event-venue {
            display: none;
        }
        
        .event-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
        }
        
        .event-favorite svg {
            width: 20px;
            height: 20px;
        }
        
        .event-price {
            font-family: 'Inter', sans-serif;
            font-size: 16px;
            font-weight: 600;
            color: #000000;
        }
        
        .event-price.free {
            color: #000000;
        }
        
        .event-favorite {
            width: 28px;
            height: 28px;
            border: none;
            background: rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.2s ease;
            color: #000000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .event-favorite:hover {
            transform: scale(1.1);
            background: rgba(255, 255, 255, 0.5);
        }
        
        .event-favorite.favorited {
            color: #ff0066;
            background: rgba(255, 255, 255, 0.8);
        }
        
        /* ===== VISTA CHAT IA ===== */
        .search-view {
            display: none;
        }
        
        .search-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .search-hero {
            text-align: center;
            margin-bottom: 32px;
        }
        
        .search-title {
            font-size: 28px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 8px;
        }
        
        .search-subtitle {
            font-size: 16px;
            color: #9ca3af;
        }
        
        .search-input-container {
            position: relative;
            margin-bottom: 24px;
        }
        
        .search-input {
            width: 100%;
            padding: 16px 50px 16px 20px;
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            font-size: 16px;
            background: rgba(45, 45, 45, 0.7);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            color: #ffffff;
            transition: all 0.2s ease;
            outline: none;
        }
        
        .search-input:focus {
            border-color: rgba(196, 253, 1, 0.6);
            background: rgba(60, 60, 60, 0.8);
            box-shadow: 0 0 0 4px rgba(196, 253, 1, 0.1);
        }
        
        .search-input::placeholder {
            color: #6b7280;
        }
        
        .search-submit {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            width: 36px;
            height: 36px;
            background: #C4FD01;
            border: none;
            border-radius: 50%;
            color: #000000;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 16px;
        }
        
        .search-submit:hover {
            background: #a8d900;
        }
        
        .search-suggestions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 32px;
        }
        
        .suggestion-chip {
            background: rgba(45, 45, 45, 0.7);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 8px 16px;
            font-size: 14px;
            color: #9ca3af;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .suggestion-chip:hover {
            background: rgba(196, 253, 1, 0.8);
            border-color: rgba(196, 253, 1, 0.6);
            color: #000000;
        }
        
        /* ===== VISTA DESCUBRE (ARREGLADA CON ALINEACIÓN CONSISTENTE) ===== */
        .explore-view {
            display: none;
        }
        
        .explore-container {
            max-width: none;
            margin: 0;
            padding: 20px 20px;
        }
        
        /* Filtros horizontales - ARREGLADOS */
        .filter-section {
            position: sticky;
            top: 0;
            z-index: 100;
            margin-bottom: 32px;
            width: 100vw;
            margin-left: calc(-50vw + 50%);
            padding: 20px 0;
        }
        
        .filter-scroll {
            display: flex;
            gap: 10px;
            overflow-x: auto;
            scroll-behavior: smooth;
            scrollbar-width: none;
            -ms-overflow-style: none;
            padding: 8px 20px;
            margin: 0;
        }
        
        .filter-scroll::-webkit-scrollbar {
            display: none;
        }
        
        .filter-chip {
            flex: 0 0 auto;
            background: rgba(45, 45, 45, 0.7);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 18px;
            padding: 0 20px;
            height: 36px;
            font-size: 16px;
            font-weight: 600;
            color: #9ca3af;
            cursor: pointer;
            white-space: nowrap;
            font-family: 'Inter', sans-serif;
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .filter-chip::before {
            display: none;
        }
        
        .filter-chip:hover:not(.active)::before {
            display: none;
        }
        
        .filter-chip:hover:not(.active) {
            background: rgba(60, 60, 60, 0.9);
            border-color: rgba(255, 255, 255, 0.2);
            color: #ffffff;
        }
        
        .filter-chip.active {
            background: rgba(196, 253, 1, 0.8);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 2px solid rgba(196, 253, 1, 0.6);
            color: #000000;
            font-weight: 600;
        }
        
        .filter-chip.active::before {
            display: none;
        }
        
        /* Feed vertical de tarjetas */
        .events-feed {
            display: flex;
            flex-direction: column;
            gap: 24px;
            max-width: none;
            margin: 0;
            width: 100%;
        }
        
        /* Tarjeta premium responsive - FOTO COMPLETA CON GLASSMORPHISM OVERLAY */
        .premium-event-card {
            width: 100%;
            height: 420px;
            background: transparent;
            border-radius: 20px;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
            margin: 0;
            border: 2px solid rgba(255, 255, 255, 0.1);
        }
        
        .premium-event-card:active {
            transform: scale(0.98);
        }
        
        .premium-card-image {
            width: 100%;
            height: 100%;
            background: #e0e0e0;
            margin: 0;
            border-radius: 20px;
            position: absolute;
            top: 0;
            left: 0;
            background-size: cover;
            background-position: center;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #999;
            font-size: 48px;
        }
        
        .premium-card-image.has-poster {
            background-image: none;
        }
        
        .premium-card-poster {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 20px;
        }
        
        .premium-card-content {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 20px;
            height: auto;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border-radius: 0 0 20px 20px;
            min-height: 100px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .premium-card-title {
            font-family: 'Inter', sans-serif;
            font-size: 18px;
            font-weight: 700;
            line-height: 118%;
            color: #ffffff;
            margin-bottom: 8px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        .premium-card-title .event-details {
            font-weight: 400;
            color: rgba(255, 255, 255, 0.8);
            font-size: 14px;
        }
        
        .premium-card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .premium-card-price {
            font-family: 'Inter', sans-serif;
            font-size: 16px;
            font-weight: 600;
            color: #ffffff;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        .premium-card-price.free {
            color: #30d158;
        }
        
        .premium-card-favorite {
            width: 28px;
            height: 28px;
            border: none;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.2s ease;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .premium-card-favorite:hover {
            transform: scale(1.1);
            background: rgba(255, 255, 255, 0.3);
        }
        
        .premium-card-favorite.favorited {
            color: #ff0066;
            background: rgba(255, 0, 102, 0.3);
            border: 1px solid rgba(255, 0, 102, 0.2);
        }
        
        /* ===== VISTA FAVORITOS ===== */
        .favorites-view {
            display: none;
        }
        
        .favorites-container {
            padding: 40px 20px;
        }
        
        .favorites-header {
            text-align: center;
            margin-bottom: 32px;
        }
        
        .favorites-title {
            font-size: 28px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 8px;
        }
        
        .favorites-subtitle {
            font-size: 16px;
            color: #9ca3af;
        }
        
        .favorites-list {
            max-width: 600px;
            margin: 0 auto;
        }
        
        .favorites-item {
            background: rgba(45, 45, 45, 0.7);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .favorites-item:hover {
            transform: translateX(4px);
            background: rgba(60, 60, 60, 0.8);
            border-color: rgba(255, 255, 255, 0.15);
            box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }
        
        .favorite-info {
            flex: 1;
        }
        
        .favorite-name {
            font-size: 16px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 4px;
        }
        
        .favorite-details {
            font-size: 14px;
            color: #9ca3af;
        }
        
        .favorite-price {
            font-size: 16px;
            font-weight: 600;
            color: #ffffff;
            margin-right: 12px;
        }
        
        .favorite-price.free {
            color: #30d158;
        }
        
        .remove-favorite {
            width: 32px;
            height: 32px;
            background: #ff3b30;
            border: none;
            border-radius: 50%;
            color: white;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 12px;
        }
        
        .remove-favorite:hover {
            background: #d70015;
            transform: scale(1.1);
        }
        
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #6b7280;
        }
        
        .empty-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .empty-text {
            font-size: 14px;
        }
        
        /* ===== INDICADOR DE CARGA ===== */
        .loading-indicator {
            display: none;
            justify-content: center;
            align-items: center;
            padding: 40px;
        }
        
        .loading-spinner {
            width: 32px;
            height: 32px;
            border: 3px solid #f0f0f0;
            border-top: 3px solid #007aff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
            .header-content {
                padding: 0 12px;
            }
            
            .nav-tabs {
                width: calc(100vw - 24px);
            }
            
            .main-content {
                padding: 16px;
            }
            
            .hero-title {
                font-size: 24px;
            }
            
            .carousel-title {
                font-size: 18px;
            }
            
            .carousel-header {
                padding: 0 16px;
            }
            
            .carousel-track {
                padding: 4px 12px 4px 12px;
                gap: 16px;
            }
            
            .event-card {
                flex: 0 0 calc(100vw - 24px);
            }
            
            .event-image {
                height: 360px;
                font-size: 36px;
            }
            
            .event-content {
                padding: 16px;
                margin-top: 0;
            }
            
            .explore-container {
                padding: 20px 12px;
            }
            
            .search-container,
            .favorites-container {
                padding: 20px 16px;
            }
            
            /* Tarjetas premium responsive */
            .events-feed {
                gap: 20px;
            }
            
            .premium-event-card {
                width: 100%;
                height: 360px;
                margin: 0;
            }
            
            .premium-card-image {
                width: 100%;
                height: 100%;
                font-size: 36px;
            }
            
            .premium-card-content {
                padding: 16px;
            }
            
            .filter-scroll {
                padding: 8px 16px;
                gap: 10px;
            }
        }
        
        @media (max-width: 480px) {
            .nav-tab {
                padding: 6px 12px;
                font-size: 12px;
            }
            
            .carousel-header {
                padding: 0 12px;
            }
            
            .carousel-track {
                padding: 4px 12px 4px 12px;
                gap: 16px;
            }
            
            .event-card {
                flex: 0 0 calc(100vw - 24px);
            }
            
            .event-image {
                height: 300px;
                font-size: 32px;
            }
            
            .event-content {
                padding: 14px;
                margin-top: 0;
            }
            
            .carousel-track {
                padding: 4px 12px 4px 12px;
                gap: 16px;
            }
            
            .premium-card-image {
                width: 100%;
                height: 100%;
                font-size: 32px;
            }
            
            .premium-card-content {
                padding: 14px;
            }
        }
    </style>
</head>
<body>
    <!-- Header Principal -->
    <header class="main-header">
        <div class="header-content">
            <nav class="nav-tabs">
                <div class="nav-slider"></div>
                <button class="nav-tab active" data-view="home">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-compass">
                        <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/>
                        <circle cx="12" cy="12" r="10"/>
                    </svg>
                    <span>Rampa</span>
                </button>
                <button class="nav-tab" data-view="search">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search">
                        <path d="m21 21-4.34-4.34"/>
                        <circle cx="11" cy="11" r="8"/>
                    </svg>
                    <span>Chat IA</span>
                </button>
                <button class="nav-tab" data-view="explore">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-grid-3x3">
                        <rect width="18" height="18" x="3" y="3" rx="2"/>
                        <path d="M9 3v18"/>
                        <path d="M15 3v18"/>
                        <path d="M3 9h18"/>
                        <path d="M3 15h18"/>
                    </svg>
                    <span>Descubre</span>
                </button>
                <button class="nav-tab" data-view="favorites">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star">
                        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>
                    </svg>
                    <span>Favoritos</span>
                </button>
            </nav>
        </div>
    </header>

    <!-- Contenido Principal -->
    <main class="main-content">
        <!-- Vista Inicio -->
        <div class="home-view" id="homeView">
            <!-- Carrusel: Recomendados -->
            <section class="carousel-section">
                <div class="carousel-header">
                    <h2 class="carousel-title">Recomendados</h2>
                    <a href="#" class="see-all-link" onclick="loadMore('recomendados')">Ver todos</a>
                </div>
                <div class="carousel-container">
                    <div class="carousel-track" id="recomendadosCarousel">
                        <!-- Eventos se cargan aquí -->
                    </div>
                </div>
            </section>
        </div>

        <!-- Vista Chat IA -->
        <div class="search-view" id="searchView">
            <div class="search-container">
                <div class="search-hero">
                    <h1 class="search-title">¿Qué querés hacer hoy?</h1>
                    <p class="search-subtitle">Pregúntame sobre eventos, horarios, precios o recomendaciones</p>
                </div>

                <div class="search-input-container">
                    <input 
                        type="text" 
                        class="search-input" 
                        id="searchInput"
                        placeholder="Ej: 'Conciertos de rock este fin de semana' o 'Teatro barato en el Centro'"
                        onkeypress="handleSearchEnter(event)"
                    >
                    <button class="search-submit" onclick="performSearch()">🔍</button>
                </div>

                <div class="search-suggestions">
                    <div class="suggestion-chip" onclick="quickSearch('eventos gratis hoy')">Eventos gratis hoy</div>
                    <div class="suggestion-chip" onclick="quickSearch('conciertos Teatro Solís')">Teatro Solís</div>
                    <div class="suggestion-chip" onclick="quickSearch('rock Antel Arena')">Rock en Antel Arena</div>
                    <div class="suggestion-chip" onclick="quickSearch('exposiciones arte')">Exposiciones de arte</div>
                    <div class="suggestion-chip" onclick="quickSearch('eventos fin de semana')">Fin de semana</div>
                    <div class="suggestion-chip" onclick="quickSearch('danza flamenco')">Danza y flamenco</div>
                </div>

                <div class="loading-indicator" id="searchLoading">
                    <div class="loading-spinner"></div>
                </div>

                <div id="searchResults"></div>
            </div>
        </div>

        <!-- Vista Descubre (Nueva) -->
        <div class="explore-view" id="exploreView" style="display: none;">
            <!-- Filtros horizontales - FUERA del contenedor -->
            <div class="filter-section">
                <div class="filter-scroll">
                    <div class="filter-chip active" data-filter="all">Esta semana</div>
                    <div class="filter-chip" data-filter="musica">Música</div>
                    <div class="filter-chip" data-filter="arte">Arte contemporáneo</div>
                    <div class="filter-chip" data-filter="teatro">Teatro</div>
                    <div class="filter-chip" data-filter="aire-libre">Aire Libre</div>
                    <div class="filter-chip" data-filter="cultura-nocturna">Cultura Nocturna</div>
                    <div class="filter-chip" data-filter="libros">Libros y Letras</div>
                </div>
            </div>
            
            <div class="explore-container">
                <!-- Feed vertical de tarjetas premium -->
                <div class="events-feed" id="eventsFeed">
                    <!-- Las tarjetas se cargan aquí -->
                </div>
            </div>
        </div>

        <!-- Vista Favoritos -->
        <div class="favorites-view" id="favoritesView">
            <div class="favorites-container">
                <div class="favorites-header">
                    <h1 class="favorites-title">Tus Favoritos</h1>
                    <p class="favorites-subtitle">Eventos guardados para no perderte nada</p>
                </div>

                <div class="favorites-list" id="favoritesList">
                    <!-- Lista de favoritos se carga aquí -->
                </div>

                <div class="empty-state" id="emptyFavorites">
                    <h3 class="empty-title">No tenés favoritos aún</h3>
                    <p class="empty-text">Explorá eventos y marcá los que te gusten</p>
                </div>
            </div>
        </div>
    </main>

    <script>
        // ===== VARIABLES GLOBALES =====
        let appManagers = {};

        // ===== FUNCIÓN PARA MOVER EL SLIDER (DESHABILITADA) =====
        function moveSlider(activeTab) {
            // Slider ocultado - solo cambio de color
            console.log(`Estado activo actualizado para:`, activeTab.dataset.view);
        }

        // ===== DATOS DE EVENTOS =====
        const EventDatabase = {
            events: [
                { id: 1, title: "Concertgebouw Chamber Orchestra", venue: "Teatro Solís", date: "30", month: "JUL", time: "19:30", price: "$1.200", category: "musica", poster: "https://www.teatrosolis.org.uy/imgnoticias/202506/W756_H530/6146.jpg", description: "Orquesta de cámara con dirección de Michael Waterman", keywords: ["clásica", "orquesta", "concertgebouw", "teatro solís"], type: "today" },
                { id: 2, title: "Tiempo Tango", venue: "Teatro Solís", date: "31", month: "JUL", time: "20:00", price: "$850", category: "danza", poster: "https://www.teatrosolis.org.uy/imgnoticias/202505/W756_H530/6093.png", description: "Ballet Nacional de Tango de Uruguay", keywords: ["tango", "ballet", "instituto pasteur"], type: "today" },
                { id: 3, title: "Madre Coraje y sus Hijos", venue: "Teatro Solís", date: "02", month: "AGO", time: "20:00", price: "$950", category: "teatro", poster: "https://www.teatrosolis.org.uy/imgnoticias/202507/W756_H530/6166.png", description: "Obra de Bertolt Brecht dirigida por Sergio Luján", keywords: ["brecht", "teatro", "madre coraje"], type: "upcoming" },
                { id: 4, title: "Emanero", venue: "Antel Arena", date: "02", month: "AGO", time: "21:00", price: "$1.500", category: "musica", poster: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&crop=face", description: "El rapero argentino en su gira latinoamericana", keywords: ["emanero", "rap", "argentina", "hip hop"], type: "upcoming" },
                { id: 5, title: "Festival de Jazz", venue: "Centro Cultural", date: "03", month: "AGO", time: "18:00", price: "Gratis", category: "musica", poster: "", description: "Festival gratuito de jazz local", keywords: ["jazz", "gratis", "festival"], type: "upcoming" },
                { id: 6, title: "Exposición Arte Contemporáneo", venue: "Museo Nacional", date: "01", month: "AGO", time: "10:00", price: "$200", category: "arte", poster: "", description: "Muestra de artistas uruguayos contemporáneos", keywords: ["arte", "contemporáneo", "museo"], type: "upcoming" }
            ],

            getByType(type) {
                return this.events.filter(event => event.type === type);
            },

            getByCategory(category) {
                return this.events.filter(event => event.category === category);
            },

            getRampaRecomienda() {
                // Eventos recomendados por la periodista cultural
                return this.events.slice(0, 6); // Muestra todos los eventos disponibles
            },

            search(query) {
                const queryLower = query.toLowerCase();
                return this.events.filter(event => {
                    const searchText = [
                        event.title,
                        event.venue,
                        event.description,
                        ...event.keywords
                    ].join(' ').toLowerCase();
                    
                    return searchText.includes(queryLower) || 
                           queryLower.split(' ').some(word => searchText.includes(word));
                });
            }
        };

        // ===== SISTEMA DE FAVORITOS =====
        class FavoritesManager {
            constructor() {
                this.favorites = [];
            }

            addFavorite(eventId) {
                if (!this.isFavorited(eventId)) {
                    this.favorites.push(eventId);
                    return true;
                }
                return false;
            }

            removeFavorite(eventId) {
                const index = this.favorites.indexOf(eventId);
                if (index > -1) {
                    this.favorites.splice(index, 1);
                    return true;
                }
                return false;
            }

            isFavorited(eventId) {
                return this.favorites.includes(eventId);
            }

            getFavoriteEvents() {
                return EventDatabase.events.filter(event => 
                    this.favorites.includes(event.id)
                );
            }
        }

        // ===== SISTEMA DE NAVEGACIÓN =====
        class ViewManager {
            constructor() {
                this.currentView = 'home';
                this.initializeNavigation();
            }

            initializeNavigation() {
                console.log('Inicializando navegación...');
                const tabs = document.querySelectorAll('.nav-tab');
                console.log('Tabs encontradas:', tabs.length);
                
                tabs.forEach((tab, index) => {
                    console.log(`Agregando listener a tab ${index}:`, tab.dataset.view);
                    tab.addEventListener('click', (e) => {
                        console.log('Tab clickeado:', e.currentTarget.dataset.view);
                        e.preventDefault();
                        e.stopPropagation();
                        const view = e.currentTarget.dataset.view;
                        this.switchView(view);
                    });
                });
            }

            switchView(viewName) {
                console.log(`Cambiando a vista: ${viewName}, actual: ${this.currentView}`);
                
                if (this.currentView === viewName) {
                    return;
                }

                document.querySelectorAll('.home-view, .search-view, .favorites-view, .explore-view')
                    .forEach(view => view.style.display = 'none');

                document.querySelectorAll('.nav-tab')
                    .forEach(tab => tab.classList.remove('active'));

                const targetView = document.getElementById(`${viewName}View`);
                if (targetView) {
                    targetView.style.display = 'block';
                    this.currentView = viewName;

                    const activeTab = document.querySelector(`[data-view="${viewName}"]`);
                    if (activeTab) {
                        activeTab.classList.add('active');
                        console.log(`Tab activado:`, activeTab);
                        
                        moveSlider(activeTab);
                    }

                    this.loadViewContent(viewName);
                }
            }

            loadViewContent(viewName) {
                switch(viewName) {
                    case 'home':
                        appManagers.carousel.loadAllCarousels();
                        break;
                    case 'explore':
                        this.loadExploreView();
                        break;
                    case 'favorites':
                        this.loadFavoritesView();
                        break;
                }
            }

            loadExploreView() {
                // Cargar eventos en el feed premium
                const feed = document.getElementById('eventsFeed');
                const allEvents = EventDatabase.events;
                
                feed.innerHTML = allEvents.map(event => this.createPremiumCard(event)).join('');
                
                // Inicializar filtros
                this.initializeFilters();
            }

            createPremiumCard(event) {
                const isFavorited = appManagers.favorites.isFavorited(event.id);
                const heartIcon = isFavorited 
                    ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-icon lucide-heart"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>`
                    : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-icon lucide-heart"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>`;
                const hasPoster = event.poster && event.poster !== '';
                
                return `
                    <div class="premium-event-card" onclick="openEventDetail(${event.id})">
                        <div class="premium-card-image ${hasPoster ? 'has-poster' : ''}" ${hasPoster ? `style="background-image: url('${event.poster}')"` : ''}>
                            ${hasPoster ? `<img src="${event.poster}" alt="${event.title}" class="premium-card-poster" onerror="this.style.display='none'; this.parentElement.classList.remove('has-poster');">` : '🎵'}
                        </div>
                        <div class="premium-card-content">
                            <h3 class="premium-card-title">${event.title}<br><span class="event-details">${event.date} ${event.month} • ${event.time} • ${event.venue}</span></h3>
                            <div class="premium-card-footer">
                                <span class="premium-card-price ${event.price === 'Gratis' ? 'free' : ''}">${event.price === 'Gratis' ? 'GRATIS' : event.price}</span>
                                <button class="premium-card-favorite ${isFavorited ? 'favorited' : ''}" onclick="event.stopPropagation(); toggleFavorite(${event.id})">
                                    ${heartIcon}
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }

            initializeFilters() {
                const filterChips = document.querySelectorAll('.filter-chip');
                filterChips.forEach(chip => {
                    chip.addEventListener('click', (e) => {
                        // Remover active de todos
                        filterChips.forEach(c => c.classList.remove('active'));
                        // Agregar active al clickeado
                        e.target.classList.add('active');
                        
                        const filter = e.target.dataset.filter;
                        this.filterEvents(filter);
                    });
                });
            }

            filterEvents(filter) {
                const feed = document.getElementById('eventsFeed');
                let filteredEvents = EventDatabase.events;
                
                if (filter !== 'all') {
                    // Mapear filtros a categorías
                    const filterMap = {
                        'musica': ['musica'],
                        'arte': ['arte'],
                        'teatro': ['teatro'],
                        'aire-libre': ['festival', 'aire-libre'],
                        'cultura-nocturna': ['musica', 'danza'],
                        'libros': ['libros', 'literatura']
                    };
                    
                    const categories = filterMap[filter] || [filter];
                    filteredEvents = EventDatabase.events.filter(event => 
                        categories.includes(event.category)
                    );
                }
                
                feed.innerHTML = filteredEvents.map(event => this.createPremiumCard(event)).join('');
            }

            loadFavoritesView() {
                const favoritesList = document.getElementById('favoritesList');
                const emptyState = document.getElementById('emptyFavorites');
                const favoriteEvents = appManagers.favorites.getFavoriteEvents();

                if (favoriteEvents.length === 0) {
                    favoritesList.style.display = 'none';
                    emptyState.style.display = 'block';
                } else {
                    favoritesList.style.display = 'block';
                    emptyState.style.display = 'none';
                    
                    favoritesList.innerHTML = favoriteEvents.map(event => `
                        <div class="favorites-item" onclick="openEventDetail(${event.id})">
                            <div class="favorite-info">
                                <div class="favorite-name">${event.title}</div>
                                <div class="favorite-details">${event.date} ${event.month} • ${event.venue} • ${event.time}</div>
                            </div>
                            <div class="favorite-price ${event.price === 'Gratis' ? 'free' : ''}">${event.price}</div>
                            <button class="remove-favorite" onclick="event.stopPropagation(); removeFavorite(${event.id})">✕</button>
                        </div>
                    `).join('');
                }
            }
        }

        // ===== SISTEMA DE CARRUSELES =====
        class CarouselManager {
            constructor() {
                this.carousels = {
                    recomendados: { container: 'recomendadosCarousel', loader: () => EventDatabase.getRampaRecomienda() }
                };
            }

            loadAllCarousels() {
                Object.keys(this.carousels).forEach(key => {
                    this.loadCarousel(key);
                });
            }

            loadCarousel(carouselType) {
                const carousel = this.carousels[carouselType];
                const container = document.getElementById(carousel.container);
                const events = carousel.loader();

                if (container) {
                    container.innerHTML = events.map(event => this.createEventCard(event)).join('');
                }
            }

            createEventCard(event) {
                const isFavorited = appManagers.favorites.isFavorited(event.id);
                const favoriteClass = isFavorited ? 'favorited' : '';
                const heartIcon = isFavorited 
                    ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-icon lucide-heart"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>`
                    : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-icon lucide-heart"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>`;
                
                const hasPoster = event.poster && event.poster !== '';
                const imageClass = hasPoster ? 'has-poster' : '';

                return `
                    <div class="event-card" onclick="openEventDetail(${event.id})">
                        <div class="event-image ${imageClass}" ${hasPoster ? `style="background-image: url('${event.poster}')"` : ''}>
                            ${hasPoster ? `<img src="${event.poster}" alt="${event.title}" class="event-poster" onerror="this.style.display='none'; this.parentElement.classList.remove('has-poster');">` : ''}
                            <div class="poster-overlay"></div>
                            <div class="event-date-badge">
                                <div class="date-day">${event.date}</div>
                                <div class="date-month">${event.month}</div>
                            </div>
                            <div class="event-category category-${event.category}">
                                ${this.getCategoryName(event.category)}
                            </div>
                            <button class="favorite-btn ${favoriteClass}" onclick="event.stopPropagation(); toggleFavorite(${event.id})">
                                ${heartIcon}
                            </button>
                        </div>
                        <div class="event-content">
                            <h3 class="event-title">${event.title}<br><span class="event-details">${event.date} ${event.month} • ${event.time} • ${event.venue}</span></h3>
                            <div class="event-meta">
                                <span class="event-price ${event.price === 'Gratis' ? 'free' : ''}">${event.price === 'Gratis' ? 'GRATIS' : event.price}</span>
                                <button class="event-favorite ${favoriteClass}" onclick="event.stopPropagation(); toggleFavorite(${event.id})">
                                    ${heartIcon}
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }

            getCategoryName(category) {
                const categories = {
                    'musica': 'Música',
                    'teatro': 'Teatro',
                    'arte': 'Arte',
                    'danza': 'Danza'
                };
                return categories[category] || category;
            }
        }

        // ===== SISTEMA DE BÚSQUEDA =====
        class SearchManager {
            constructor() {
                this.isSearching = false;
            }

            async performSearch(query) {
                if (this.isSearching || !query.trim()) return;

                this.isSearching = true;
                this.showLoading();

                try {
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    const results = EventDatabase.search(query);
                    this.displaySearchResults(results, query);
                } catch (error) {
                    console.error('Error en búsqueda:', error);
                } finally {
                    this.hideLoading();
                    this.isSearching = false;
                }
            }

            displaySearchResults(results, query) {
                const container = document.getElementById('searchResults');
                
                if (results.length === 0) {
                    container.innerHTML = `
                        <div class="empty-state">
                            <h3 class="empty-title">No encontramos resultados</h3>
                            <p class="empty-text">Probá con otros términos como "rock", "teatro" o "gratis"</p>
                        </div>
                    `;
                    return;
                }

                container.innerHTML = `
                    <div style="margin-bottom: 20px;">
                        <h3 style="font-size: 18px; color: #1d1d1f; margin-bottom: 8px;">
                            Encontramos ${results.length} eventos para "${query}"
                        </h3>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;">
                        ${results.map(event => appManagers.carousel.createEventCard(event)).join('')}
                    </div>
                `;
            }

            showLoading() {
                document.getElementById('searchLoading').style.display = 'flex';
                document.getElementById('searchResults').innerHTML = '';
            }

            hideLoading() {
                document.getElementById('searchLoading').style.display = 'none';
            }
        }

        // ===== FUNCIONES GLOBALES =====
        function switchView(viewName) {
            if (appManagers.view) {
                appManagers.view.switchView(viewName);
            }
        }

        function toggleFavorite(eventId) {
            const button = event.target.closest('.premium-card-favorite') || event.target.closest('.favorite-btn') || event.target.closest('.event-favorite');
            const isFavorited = appManagers.favorites.isFavorited(eventId);

            if (isFavorited) {
                appManagers.favorites.removeFavorite(eventId);
                if (button) {
                    button.classList.remove('favorited');
                    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-icon lucide-heart"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>`;
                }
            } else {
                appManagers.favorites.addFavorite(eventId);
                if (button) {
                    button.classList.add('favorited');
                    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-icon lucide-heart"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>`;
                }
            }

            if (appManagers.view.currentView === 'favorites') {
                appManagers.view.loadFavoritesView();
            }
        }

        function removeFavorite(eventId) {
            appManagers.favorites.removeFavorite(eventId);
            appManagers.view.loadFavoritesView();
        }

        function performSearch() {
            const query = document.getElementById('searchInput').value.trim();
            if (query) {
                appManagers.search.performSearch(query);
            }
        }

        function quickSearch(query) {
            document.getElementById('searchInput').value = query;
            appManagers.search.performSearch(query);
        }

        function handleSearchEnter(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        }

        function openEventDetail(eventId) {
            const event = EventDatabase.events.find(e => e.id === eventId);
            if (event) {
                alert(`${event.title}\n\n${event.venue}\n${event.date} ${event.month} a las ${event.time}\n${event.price}\n\n${event.description}`);
            }
        }

        function loadMore(category) {
            alert(`Cargando más eventos de: ${category}`);
        }

        // ===== INICIALIZACIÓN =====
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM cargado, inicializando...');
            
            appManagers.favorites = new FavoritesManager();
            appManagers.view = new ViewManager();
            appManagers.carousel = new CarouselManager();
            appManagers.search = new SearchManager();

            appManagers.carousel.loadAllCarousels();
            
            console.log('Managers inicializados:', appManagers);
            
            setTimeout(() => {
                const activeTab = document.querySelector('.nav-tab.active');
                console.log('Tab activo encontrado:', activeTab);
                if (activeTab) {
                    moveSlider(activeTab);
                }
            }, 100);
        });
    </script>
</body>
</html>
