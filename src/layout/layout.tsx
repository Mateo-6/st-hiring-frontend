import { useState } from "react";

//Pages
import { EventPageMemo } from "../pages/event/event-page"
import { SettingsPage } from "../pages/settings/settings-page"

// StyledComponents
import { Span, SpanContainer, Container, PageContainer } from "./styled"

export function Layout() {
  const [isEventPageVisible, setEventPageVisible] = useState(true);
  
  return(
  <Container>
    <SpanContainer>
      <Span isVisible={!isEventPageVisible} onClick={() => setEventPageVisible(true)}>Go to Events Page</Span>
      <Span isVisible={isEventPageVisible} onClick={() => setEventPageVisible(false)}>Go to Settings Page</Span>
    </SpanContainer>
    <PageContainer isVisible={isEventPageVisible}>
      <EventPageMemo />
    </PageContainer>
    <PageContainer isVisible={!isEventPageVisible}>
      <SettingsPage />
    </PageContainer>
  </Container>)
}