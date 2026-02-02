<template>
  <div class="designer-collaboration-page">
    <div class="hero-banner">
      <div class="hero-content">
        <h1 class="page-title">設計師聯名專區</h1>
        <p class="page-description">
          探索獨一無二的藝術融合！我們與全球頂尖設計師合作，將創意與時尚注入日常，為你帶來限量典藏的聯名系列。
        </p>
      </div>
    </div>

    <div class="container">
      <div class="collaboration-grid">
        <div
          v-for="collaboration in collaborations"
          :key="collaboration.id"
          class="collaboration-card"
          @click="goToDetail(collaboration.route)"
        >
          <img :src="collaboration.image" :alt="collaboration.title" class="collaboration-image" />
          <div class="collaboration-overlay">
            <h2 class="collaboration-title">{{ collaboration.title }}</h2>
            <p class="collaboration-slogan">{{ collaboration.slogan }}</p>
            <button class="view-details-btn">探索系列</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 模擬設計師聯名款數據
// 你可以根據實際需求從 API 獲取
const collaborations = [
  {
    id: 1,
    title: '未來主義 - Zaha Hadid 系列',
    slogan: '流動的建築語彙，穿戴在你的生活之中。',
    // 改用 picsum.photos，後面加上 ?random=1 確保圖片不同
    image: 'https://picsum.photos/1200/800?random=1',
    route: '/crossover/designer/zaha-hadid',
  },
  {
    id: 2,
    title: '色彩碰撞 - Yayoi Kusama 系列',
    slogan: '點點狂想，讓你的世界充滿無限活力。',
    image: 'https://picsum.photos/1200/800?random=2',
    route: '/crossover/designer/yayoi-kusama',
  },
  {
    id: 3,
    title: '東方禪意 - Naoto Fukasawa 系列',
    slogan: '簡約之美，於無形中感受設計的溫度。',
    image: 'https://picsum.photos/1200/800?random=3',
    route: '/crossover/designer/naoto-fukasawa',
  },
  {
    id: 4,
    title: '塗鴉詩篇 - KAWS 系列',
    slogan: '街頭藝術的叛逆與幽默，顛覆你的想像。',
    image: 'https://picsum.photos/1200/800?random=4',
    route: '/crossover/designer/kaws',
  },
  {
    id: 5,
    title: '建築幾何 - Zaha Hadid',
    slogan: '流動的曲線，打破空間邊界。',
    image: 'https://picsum.photos/1200/800?random=11',
    route: '/crossover/designer/zaha-hadid',
  },
  {
    id: 6,
    title: '點點狂想 - Yayoi Kusama',
    slogan: '無限的圓點，構成藝術的宇宙。',
    image: 'https://picsum.photos/1200/800?random=12',
    route: '/crossover/designer/yayoi-kusama',
  },
  {
    id: 7,
    title: '極簡直覺 - 深澤直人',
    slogan: '不多不少，剛好就是最美的設計。',
    image: 'https://picsum.photos/1200/800?random=13',
    route: '/crossover/designer/naoto-fukasawa',
  },
  {
    id: 8,
    title: '潮流叛逆 - KAWS',
    slogan: '街頭符號與現代藝術的完美碰撞。',
    image: 'https://picsum.photos/1200/800?random=14',
    route: '/crossover/designer/kaws',
  },
  {
    id: 9,
    title: '超現實感 - Salvador Dalí',
    slogan: '夢境與現實的交錯，時間的流動質感。',
    image: 'https://picsum.photos/1200/800?random=15',
    route: '/crossover/designer/dali',
  },
  {
    id: 10,
    title: '數位禪意 - 原研哉',
    slogan: '空（Emptiness）的力量，設計的本質。',
    image: 'https://picsum.photos/1200/800?random=16',
    route: '/crossover/designer/kenya-hara',
  },
  {
    id: 11,
    title: '光影藝術 - 安藤忠雄',
    slogan: '清水混凝土與自然光線的詩意。',
    image: 'https://picsum.photos/1200/800?random=17',
    route: '/crossover/designer/tadao-ando',
  },
  {
    id: 12,
    title: '大眾普普 - Andy Warhol',
    slogan: '藝術就是你所能逃脫的一切。',
    image: 'https://picsum.photos/1200/800?random=18',
    route: '/crossover/designer/warhol',
  },
]

const goToDetail = (route) => {
  router.push(route)
}
</script>

<style scoped>
.designer-collaboration-page {
  text-align: center;
}

.hero-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100vh; /* 設定大圖高度 */
  background-image: url('https://picsum.photos/1920/1080?random=10');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  margin-bottom: 50px;
  position: relative;
  overflow: hidden;
  min-height: 110vh;
  margin-top: -110px;
}

.hero-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* 50% 透明度黑底 */
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  padding: 0 20px;
}

.page-title {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 800;
  letter-spacing: 12px;
  margin: 25px 0;
  text-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.page-description {
  font-size: clamp(1.2rem, 1vw, 4.5rem);
  letter-spacing: 2px;
  opacity: 0.9;
}

/* --- 商品內容區樣式 --- */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 50px 100px;
  /* width: 100px; */
}

.collaboration-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.collaboration-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.collaboration-card {
  position: relative;
  overflow: hidden;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  aspect-ratio: 4/4;
}

.collaboration-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.collaboration-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.collaboration-card:hover .collaboration-image {
  transform: scale(1.05);
}

.collaboration-overlay {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 50%);
  padding: 25px;
  box-sizing: border-box;
  color: white;
  text-align: left;
  opacity: 1;
  transition: background 0.3s ease;
}

.collaboration-card:hover .collaboration-overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 50%);
}

.collaboration-title {
  font-size: 1.6em;
  margin-bottom: 10px;
  font-weight: bold;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
}

.collaboration-slogan {
  font-size: 0.9em;
  margin-bottom: 20px;
  max-width: 100%; /* 限制文字寬度 */
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
}

.view-details-btn {
  /* display: flex;
  align-items: center;
  justify-content: center;
  position: relative; */
  background-color: #f0c14b;
  color: #333;
  border: none;
  padding: 8px 18px;
  border-radius: 50px;
  font-size: 0.9em;
  font-weight: bold;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.view-details-btn:hover {
  background-color: #e0b03b;
  transform: translateY(-3px);
}

/* 針對小螢幕設備進行調整 */
@media (max-width: 768px) {
  .hero-banner {
    height: 300px;
  }
  .page-title {
    font-size: 2em;
  }
  .page-description {
    font-size: 1em;
    margin-bottom: 30px;
  }
  .collaboration-grid {
    grid-template-columns: 1fr; /* 單列佈局 */
  }
  .collaboration-overlay {
    padding: 20px;
  }
  .collaboration-title {
    font-size: 1.5em;
  }
  .collaboration-slogan {
    font-size: 0.9em;
  }
  .view-details-btn {
    padding: 10px 20px;
    font-size: 1em;
  }
}
</style>
