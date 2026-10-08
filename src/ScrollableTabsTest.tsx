import React, {useState, useRef, useEffect, useCallback} from 'react';

interface TabItem {
  id: number,
  title: string,
  content: string
}

const tabsData: TabItem[] = [
  { id: 1, title: 'HTML/CSS', content: 'HTML 및 CSS 기초 퍼블리싱 내용입니다.' },
  { id: 2, title: 'JavaScript', content: '자바스크립트 핵심 문법과 DOM 제어입니다.' },
  { id: 3, title: 'React Basic', content: '리액트 컴포넌트, Props, State 학습입니다.' },
  { id: 4, title: 'Tailwind CSS', content: '유틸리티 클래스 기반 스타일링입니다.' },
  { id: 5, title: 'TypeScript', content: '안전한 타입 기반 프론트엔드 개발입니다.' },
  { id: 6, title: 'Web Accessibility', content: '웹 접근성 지침 및 WAI-ARIA 적용입니다.' },
];

const ToggleMenu: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [isScrollable, setIsScrollable] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabsRefs = useRef< {[key: number]: HTMLDivElement | null} >({});

  const currentIndex = tabsData.findIndex((tab) => tab.id === activeTab);
};

export default ToggleMenu;

