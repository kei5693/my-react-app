import React, { useState, useRef, useEffect, useCallback } from 'react';

interface TabItem {
  id: number;
  title: string;
  content: string;
}

const tabsData: TabItem[] = [
  { id: 1, title: 'HTML/CSS', content: 'HTML 및 CSS 기초 퍼블리싱 내용입니다.' },
  { id: 2, title: 'JavaScript', content: '자바스크립트 핵심 문법과 DOM 제어입니다.' },
  { id: 3, title: 'React Basic', content: '리액트 컴포넌트, Props, State 학습입니다.' },
  { id: 4, title: 'Tailwind CSS', content: '유틸리티 클래스 기반 스타일링입니다.' },
  { id: 5, title: 'TypeScript', content: '안전한 타입 기반 프론트엔드 개발입니다.' },
  { id: 6, title: 'Web Accessibility', content: '웹 접근성 지침 및 WAI-ARIA 적용입니다.' },
];

const ScrollableTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [isScrollable, setIsScrollable] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

  // 현재 활성화된 탭의 인덱스
  const currentIndex = tabsData.findIndex((tab) => tab.id === activeTab);

  // 현재 활성화된 탭의 최신 값을 ref로 유지 (리사이즈 핸들러에서 참조)
  const activeTabRef = useRef(activeTab);
  activeTabRef.current = activeTab;

  // 특정 탭을 컨테이너 중앙으로 스크롤하는 함수
  const scrollToTab = useCallback((id: number, smooth: boolean = true) => {
    const element = tabRefs.current[id];
    if (element) {
      element.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, []);

  // 스크롤이 필요한 상태(콘텐츠가 컨테이너를 넘어감)인지 확인
  const checkScrollable = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setIsScrollable(container.scrollWidth > container.clientWidth);
  }, []);

  // 화면 크기 또는 컨테이너 너비 변경 시 스크롤 필요 여부 재계산 및 활성 탭 재중앙 정렬
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScrollable();

    let resizeTimer: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      checkScrollable();

      // 리사이즈(PC <-> 모바일 전환 등) 발생 시 활성화된 탭을 중앙으로 다시 정렬
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        scrollToTab(activeTabRef.current, true);
      }, 100);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(resizeTimer);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [checkScrollable, scrollToTab]);

  const handleTabClick = (id: number): void => {
    setActiveTab(id);
    scrollToTab(id, true);
  };

  // 좌/우 버튼 클릭 시 순서대로 탭 선택 및 이동
  const handleStepTab = (direction: 'prev' | 'next') => {
    const targetIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex >= 0 && targetIndex < tabsData.length) {
      handleTabClick(tabsData[targetIndex].id);
    }
  };

  // 스크롤이 있는 경우에만 표시하되, 이전/다음 탭 존재 여부에 따라 제어
  const canGoPrev = isScrollable && currentIndex > 0;
  const canGoNext = isScrollable && currentIndex < tabsData.length - 1;

  return (
    <div className="w-full mx-auto p-4 bg-white rounded-lg shadow">
      {/* 탭 헤더 영역 (좌우 버튼 포함) */}
      <div className="relative border-b border-gray-200">
        {/* 좌측 스크롤 버튼 (이전 탭으로 이동) */}
        {canGoPrev && (
          <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center pr-3 bg-gradient-to-r from-white via-white/80 to-transparent">
            <button
              type="button"
              onClick={() => handleStepTab('prev')}
              aria-label="이전 탭으로 이동"
              className="p-1.5 rounded-full bg-white shadow-md border border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* 탭 타이틀 스크롤 영역 */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto py-2 gap-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
        >
          {tabsData.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el: HTMLButtonElement | null) => {
                  tabRefs.current[tab.id] = el;
                }}
                onClick={() => handleTabClick(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.title}
              </button>
            );
          })}
        </div>

        {/* 우측 스크롤 버튼 (다음 탭으로 이동) */}
        {canGoNext && (
          <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center pl-3 bg-gradient-to-l from-white via-white/80 to-transparent">
            <button
              type="button"
              onClick={() => handleStepTab('next')}
              aria-label="다음 탭으로 이동"
              className="p-1.5 rounded-full bg-white shadow-md border border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* 탭 컨텐츠 영역 */}
      <div className="mt-4 p-4 bg-gray-50 rounded-md min-h-[120px]">
        {tabsData.map((tab) => {
          if (tab.id !== activeTab) return null;
          return (
            <div key={tab.id} className="text-gray-800">
              <h3 className="font-bold text-lg mb-2">{tab.title} 컨텐츠</h3>
              <p>{tab.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScrollableTabs;