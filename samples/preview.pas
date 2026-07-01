{
  Author: Wallace Ferreira
  Description: Delphi IDE Theme sample file.
  Purpose: Visual validation of syntax highlighting.
}

unit SampleUnit;

interface

uses
  System.SysUtils,
  System.Classes,
  System.Generics.Collections;

type
  ILogger = interface
    ['{12345678-ABCD-1234-ABCD-1234567890AB}']
    procedure Log(const AMessage: string);
  end;

  TPerson = class
  private
    FName: string;
    FAge: Integer;
  public
    constructor Create(const AName: string; AAge: Integer);
    procedure CelebrateBirthday;
    function Description: string;
    property Name: string read FName write FName;
    property Age: Integer read FAge write FAge;
  end;

implementation

constructor TPerson.Create(const AName: string; AAge: Integer);
begin
  inherited Create;
  FName := AName;
  FAge := AAge;
end;

procedure TPerson.CelebrateBirthday;
var
  I: Integer;
begin
  for I := 1 to 3 do
  begin
    if I mod 2 = 0 then
    begin
      while FAge < 100 do
      begin
        try
          case I of
            1:
              begin
                repeat
                  Inc(FAge);

                  if FAge > 50 then
                  begin
                    Break;
                  end;

                until FAge > 60;
              end;
          end;
        except
          on E: Exception do
          begin
            raise;
          end;
        end;
      end;
    end;
  end;
end;

function TPerson.Description: string;
begin
  Result := Format('%s (%d years)', [FName, FAge]);
end;

end.