import { ConnectWallet, Web3Button, useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { NextPage } from "next";
import { Container, Stack ,Flex,Input, Text ,Skeleton, Box, Card, SimpleGrid ,CardBody, Heading} from "@chakra-ui/react";
import { ethers } from "ethers";
import React, { useState } from "react";


const Home: NextPage = () => {

  const address = useAddress(); //checks if any address is connected to the wallet and if there is any then it puts it inside the contract const

  const contractAddress = "0xC931F742d3667EdAe5F8012E3439065615353B50"

  const {contract} = useContract(contractAddress); // useContract Hook: takes contract address and thius we can take information about the contract\
  
  const {data : totalCoffees , isLoading: loadingTotalCoffee} = useContractRead(contract, "gettotalCoffee") // this hook allow to use read contracts
  const {data: recentCoffee, isLoading: loadingRecentCoffee} = useContractRead(contract, "getAllCoffee")

  const [message, setMessage] = useState<string>("")
  const [name, setName] = useState<string>("")

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
    setMessage(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  function clearValues (){
    setMessage("")
    setName("")
  }
  
    return (
    <Container maxW={"1200px"} w={"full"}>
      <Flex justifyContent={"space-between"} alignItems={"center"} py={"20px"} height={"80px"}>
        <Box>
          <Text fontWeight={"bold"}>Buy me a Coffee</Text>
        </Box>
        <ConnectWallet/>
      </Flex>
      <SimpleGrid columns={2} spacing={10} mt={"40px"}>
        <Box>
          <Card>
            <CardBody>
              <Heading mb={"20px"}> Buy a Coffee</Heading>
              <Flex direction={"row"}>
                <Text>Total Coffee: </Text>
                <Skeleton isLoaded={!loadingTotalCoffee} width={"20px"} ml={"5px"} >
                  {totalCoffees?.toString()}
                </Skeleton>
                </Flex>

                <Text fontSize={"2xl"} py={"10px"}>Name: </Text>
                <Input
                required
                  placeholder="John Doe"
                  maxLength={16}
                  value={name}
                  onChange={handleNameChange}
                />
                <Text fontSize={"2xl"} mt={"10px"} py={"10px"}>Message: </Text>
                <Input
                  placeholder="Hello"
                  maxLength={80}
                  value={message}
                  onChange={handleMessageChange }
                  required
                />
                <Box mt={"20px"}>
                  {address ? (
                  <Web3Button
                    contractAddress={contractAddress}
                    action={(contract) =>{
                      contract.call("buyCoffee", [message, name], {value: ethers.utils.parseEther("0.01")})
                    }}
                    onSuccess={()=> clearValues()}
                  >{"Buy a Coffee 0.01 Ether"}</Web3Button>

                  ):(
                    <Text>Please Connect your wallet</Text>
                  )}
                </Box>
              
            </CardBody>
          </Card>
        </Box>

        <Box>
          <Card maxH={"60vh"} overflow={"scroll"}>
            <CardBody>
              <Text fontWeight={"bold"}>Recent messages</Text>
              {!loadingRecentCoffee ? (
                <Box>
                  {recentCoffee && recentCoffee.map((coffee: any, index: number)=>{
                    return (
                      <Card key={index} my={"10px"}>
                        <CardBody>
                          <Text fontSize={"2xl"}>{coffee[1]}</Text>
                          <Text>From : {coffee[2]}</Text>
                        </CardBody>
                      </Card>
                    )
                  }).reverse()}
                </Box>
              ) : (
                <Stack>
                  <Skeleton height={"100px"}/>
                  <Skeleton height={"100px"}/>
                  <Skeleton height={"100px"}/>
                </Stack>
              )}
            </CardBody>

          </Card>

        </Box>
      </SimpleGrid>

    </Container>
  );
};

export default Home;
