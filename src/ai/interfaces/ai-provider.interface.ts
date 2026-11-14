export interface AIProvider {
    generateText(
        systemPrompt: string,
        userPrompt: string,
    ): Promise<string>;

    generateJson(
        systemPrompt: string,
        userPrompt: string,
    ): Promise<string>;
}