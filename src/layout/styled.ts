import styled from '@emotion/styled';

interface PageContainerProps {
  isVisible: boolean;
}

const Span = styled.span<PageContainerProps>`
  cursor: pointer;
  padding: 10px;
  &:hover {
    color: #afafaf;
  }
  display: ${(props) => (props.isVisible ? 'block' : 'none')};
`;

const SpanContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 10px;
`;

const Container = styled.main`
  width: 80%;
`;

const PageContainer = styled.div<PageContainerProps>`
  display: ${(props) => (props.isVisible ? 'block' : 'none')};
`;

export { Span, SpanContainer, Container, PageContainer };
